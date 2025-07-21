import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { QuizJsonResponse } from "../types/quiz";

interface QuizResultsPDFOptions {
  quiz: QuizJsonResponse;
  answers: Record<string, string>;
  correctAnswers: string[];
  aiFeedback: {
    feedback: string;
    review: string;
  } | null;
}

export const generateQuizPDF = async (quiz: QuizJsonResponse) => {
  const pdfDoc = await PDFDocument.create();

  // Fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Colors
  const primaryColor = rgb(108 / 255, 78 / 255, 140 / 255);
  const grayColor = rgb(173 / 255, 171 / 255, 174 / 255);
  const blackColor = rgb(14 / 255, 14 / 255, 15 / 255);

  // Options
  const optionBullets: Record<number, string> = {
    0: "a) ",
    1: "b) ",
    2: "c) ",
    3: "d) ",
  };

  // Brand
  const brandImageBytes = await fetch("/intelliquiz/images/brand.png").then(
    (res) => res.arrayBuffer(),
  );
  const brandImage = await pdfDoc.embedPng(brandImageBytes);
  const brandDims = brandImage.scale(0.1);

  // Dimensions
  let currentPage = pdfDoc.addPage();
  let yPosition = currentPage.getHeight() - 50;

  const pageWidth = currentPage.getWidth();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  // Text helper function
  const addWrappedText = (
    text: string,
    x: number,
    maxWidth: number,
    fontSize: number,
    font: any,
    color: any = blackColor,
  ) => {
    const words = text.split(" ");
    let lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    for (const line of lines) {
      if (yPosition < 80) {
        currentPage = pdfDoc.addPage();
        yPosition = currentPage.getHeight();
      }

      currentPage.drawText(line, {
        x,
        y: yPosition,
        size: fontSize,
        font,
        color,
      });

      yPosition -= fontSize + 4;
    }

    return yPosition;
  };

  // New page position helper
  const checkNewPage = (spaceNeeded: number) => {
    if (yPosition - spaceNeeded < 80) {
      currentPage = pdfDoc.addPage();
      yPosition = currentPage.getHeight() - 50;
    }
  };

  // --------------- Title ------------------------
  currentPage.drawImage(brandImage, {
    x: margin - 5,
    y: currentPage.getHeight() - 30 - brandDims.height,
    width: brandDims.width,
    height: brandDims.height,
  });

  yPosition -= brandDims.height + 20;

  if (quiz.cover.title) {
    yPosition = addWrappedText(
      quiz.cover.title,
      margin,
      contentWidth,
      20,
      boldFont,
      primaryColor,
    );
  }

  if (quiz.cover.description) {
    yPosition -= 10;
    yPosition = addWrappedText(
      quiz.cover.description,
      margin,
      contentWidth,
      12,
      regularFont,
    );
  }

  yPosition -= 30;

  // --------------- Quiz Questions ------------------------

  quiz.questions.forEach((question, index) => {
    checkNewPage(120);

    yPosition = addWrappedText(
      `Question ${index + 1}: `,
      margin,
      contentWidth,
      14,
      boldFont,
    );

    yPosition -= 5;

    yPosition = addWrappedText(
      question.question,
      margin + 10,
      contentWidth - 10,
      12,
      regularFont,
    );

    yPosition -= 5;

    question.options?.forEach((option, index) => {
      yPosition = addWrappedText(
        `${optionBullets[index]}${option}`,
        margin + 10,
        contentWidth - 10,
        12,
        regularFont,
      );
    });

    yPosition -= 20;
  });

  // --------------- Answer Key ------------------------

  currentPage = pdfDoc.addPage();
  yPosition = currentPage.getHeight() - 50;

  yPosition = addWrappedText(
    "Answer Key",
    margin,
    contentWidth,
    20,
    boldFont,
    primaryColor,
  );
  yPosition -= 20;

  quiz.questions.forEach((question, index) => {
    checkNewPage(40);

    yPosition = addWrappedText(
      `Question ${index + 1}: ${question.answer}`,
      margin,
      contentWidth,
      12,
      regularFont,
    );

    yPosition -= 10;
  });

  currentPage.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
    x: margin,
    y: 30,
    size: 10,
    font: regularFont,
    color: grayColor,
  });

  // --------------- Finalize & Download ------------------------

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `quiz-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const generateQuizResultsPDF = async (
  options: QuizResultsPDFOptions,
) => {
  const { quiz, answers, correctAnswers, aiFeedback } = options;

  const pdfDoc = await PDFDocument.create();

  // Fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Colors
  const primaryColor = rgb(108 / 255, 78 / 255, 140 / 255);
  const successColor = rgb(60 / 255, 162 / 255, 119 / 255);
  const errorColor = rgb(237 / 255, 85 / 255, 59 / 255);
  const grayColor = rgb(173 / 255, 171 / 255, 174 / 255);
  const blackColor = rgb(14 / 255, 14 / 255, 15 / 255);

  // Brand
  const brandImageBytes = await fetch("/intelliquiz/images/brand.png").then(
    (res) => res.arrayBuffer(),
  );
  const brandImage = await pdfDoc.embedPng(brandImageBytes);
  const brandDims = brandImage.scale(0.1);

  // Dimensions
  let currentPage = pdfDoc.addPage();
  let yPosition = currentPage.getHeight() - 50;

  const pageWidth = currentPage.getWidth();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  // Text helper function
  const addWrappedText = (
    text: string,
    x: number,
    maxWidth: number,
    fontSize: number,
    font: any,
    color: any = blackColor,
  ) => {
    const words = text.split(" ");
    let lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    for (const line of lines) {
      if (yPosition < 80) {
        currentPage = pdfDoc.addPage();
        yPosition = currentPage.getHeight();
      }

      currentPage.drawText(line, {
        x,
        y: yPosition,
        size: fontSize,
        font,
        color,
      });

      yPosition -= fontSize + 4;
    }

    return yPosition;
  };

  // New page position helper
  const checkNewPage = (spaceNeeded: number) => {
    if (yPosition - spaceNeeded < 80) {
      currentPage = pdfDoc.addPage();
      yPosition = currentPage.getHeight() - 50;
    }
  };

  currentPage.drawImage(brandImage, {
    x: margin - 5,
    y: currentPage.getHeight() - 30 - brandDims.height,
    width: brandDims.width,
    height: brandDims.height,
  });

  yPosition -= brandDims.height + 20;

  yPosition = addWrappedText(
    "Quiz Results Report",
    margin,
    contentWidth,
    24,
    boldFont,
    primaryColor,
  );

  yPosition -= 20;

  if (quiz.cover.title) {
    yPosition = addWrappedText(
      quiz.cover.title,
      margin,
      contentWidth,
      18,
      boldFont,
    );
  }

  const score = `${correctAnswers.length}/${quiz.questions.length}`;
  const percentage = Math.round(
    (correctAnswers.length / quiz.questions.length) * 100,
  );

  yPosition = addWrappedText(
    `Final Score: ${score} (${percentage})`,
    margin,
    contentWidth,
    16,
    boldFont,
    percentage >= 70 ? successColor : errorColor,
  );

  yPosition -= 20;

  if (aiFeedback?.feedback) {
    checkNewPage(100);

    yPosition = addWrappedText(
      "Feedback",
      margin,
      contentWidth,
      14,
      boldFont,
      primaryColor,
    );

    yPosition -= 5;

    yPosition = addWrappedText(
      aiFeedback.feedback,
      margin,
      contentWidth,
      12,
      regularFont,
    );

    yPosition -= 20;
  }

  quiz.questions.forEach((question, index) => {
    checkNewPage(120);

    yPosition = addWrappedText(
      `Question ${index + 1}:`,
      margin,
      contentWidth,
      12,
      boldFont,
    );

    yPosition -= 5;

    yPosition = addWrappedText(
      question.question,
      margin + 15,
      contentWidth - 15,
      12,
      regularFont,
    );

    yPosition -= 10;

    const userAnswer = answers[index] || "No answer";
    const isCorrect = question.answer === userAnswer;

    yPosition = addWrappedText(
      `Your Answer: ${userAnswer}`,
      margin + 15,
      contentWidth - 15,
      12,
      regularFont,
      isCorrect ? successColor : errorColor,
    );

    if (!isCorrect && question.answer) {
      yPosition -= 5;
      yPosition = addWrappedText(
        `Correct Answer: ${question.answer}`,
        margin + 15,
        contentWidth - 15,
        12,
        regularFont,
        successColor,
      );
    }

    yPosition -= 20;
  });

  if (aiFeedback?.review) {
    checkNewPage(100);

    yPosition = addWrappedText(
      "What to Review",
      margin,
      contentWidth,
      14,
      boldFont,
      primaryColor,
    );

    yPosition -= 5;

    yPosition = addWrappedText(
      aiFeedback.review,
      margin,
      contentWidth,
      12,
      regularFont,
    );
  }

  const generationDate = new Date().toLocaleDateString();
  const footerY = 30;
  currentPage.drawText(`Generated on ${generationDate}`, {
    x: margin,
    y: footerY,
    size: 10,
    font: regularFont,
    color: grayColor,
  });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `quiz-results-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const downloadQuiz = async (quiz: QuizJsonResponse) => {
  try {
    await generateQuizPDF(quiz);
  } catch (error) {
    console.error("Error generating quiz PDF: ", error);
    alert("Failed to generate quiz PDF. Please try again later.");
  }
};

export const downloadQuizResults = async (
  quiz: QuizJsonResponse,
  answers: Record<string, string>,
  correctAnswers: string[],
  aiFeedback: { feedback: string; review: string } | null,
) => {
  try {
    await generateQuizResultsPDF({
      quiz,
      answers,
      correctAnswers,
      aiFeedback,
    });
  } catch (error) {
    console.error("Error generating PDF: ", error);
    alert("Failed to generate PDF. Please try again later.");
  }
};
