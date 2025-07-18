import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

export const extractTextFromFile = async (file: File): Promise<string> => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension) throw new Error("File has no extension");

  if (extension === "txt") {
    return await readTxt(file);
  } else if (extension === "pdf") {
    return await readPdf(file);
  } else if (extension === "docx") {
    return await readDocx(file);
  } else {
    throw new Error("Unsupported file type");
  }
};

const readTxt = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const readPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();

  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_, i) => {
      const page = await pdf.getPage(i + 1);
      const textContent = await page.getTextContent();
      return textContent.items.map((item: any) => item.str).join(" ");
    }),
  );

  return pages.join("\n\n");
};

const readDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages && result.messages.length > 0) {
      console.warn("Mammoth parsing warnings: ", result.messages);
    }

    return result.value || "";
  } catch (error) {
    console.error("Error reading DOCX file: ", error);
    throw new Error("Failed to extract text from Word document");
  }
};
