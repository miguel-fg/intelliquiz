import { useState, useEffect } from "react";
import { useQuiz } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import {
  loadAnswersFromStorage,
  loadFeedbackFromStorage,
  saveFeedbackToStorage,
} from "../scripts/localStorage";
import ButtonInput from "../components/inputs/ButtonInput";
import LoadingSpinner from "../components/LoadingSpinner";
import { QuizQuestion } from "../types/quiz";
import api from "../scripts/axiosInstance";
import { downloadQuizResults } from "../scripts/pdfHelper";

const Score = () => {
  const { quiz, answers, setAnswers, clear } = useQuiz();

  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [showLoading, setShowLoading] = useState(true);
  const [aiFeedback, setAIFeedback] = useState<{
    feedback: string;
    review: string;
  } | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const navigate = useNavigate();

  if (!quiz || quiz === "loading" || quiz === "error") {
    return <></>;
  }

  const exitQuiz = () => {
    clear();
    navigate("/");
  };

  const getAnswerClass = (question: QuizQuestion, userAnswer: string) => {
    if (question.type === "open") return "";
    return userAnswer === question.answer
      ? "bg-success-200 border-success-500"
      : "bg-error-200 border-error-500";
  };

  const getFeedback = async () => {
    const correct = quiz.questions
      .filter((q, i) => q.answer === answers[i])
      .map((q) => q.question);
    const wrong = quiz.questions
      .filter((q, i) => q.answer !== answers[i])
      .map((q) => q.question);

    setCorrectAnswers(correct);

    const local = loadFeedbackFromStorage();
    if (local) {
      setAIFeedback(local);
      return;
    }

    const data = {
      correct,
      wrong,
    };

    try {
      const response = await api.post("/gpt/feedback", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const feedback = response.data;
      setAIFeedback(feedback);
      saveFeedbackToStorage(feedback);
    } catch (error) {}
  };

  const handleDownloadResultsPDF = async () => {
    setDownloadingPDF(true);

    try {
      await downloadQuizResults(quiz, answers, correctAnswers, aiFeedback);
    } catch (error) {
      console.error("Error downloading PDF: ", error);
    } finally {
      setDownloadingPDF(false);
    }
  };

  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      const storedAnswers = loadAnswersFromStorage();
      setAnswers(storedAnswers);
    }
  }, [answers, setAnswers]);

  useEffect(() => {
    if (aiFeedback) {
      setShowLoading(false);
    }
  }, [aiFeedback]);

  useEffect(() => {
    if (Object.keys(answers).length > 0 && !aiFeedback) {
      getFeedback();
    }
  }, [answers, aiFeedback]);

  return (
    <div className="flex justify-center w-full @container">
      {showLoading && (
        <div className="fixed inset-0 z-10 bg-primary-700 flex flex-col justify-center items-center">
          <LoadingSpinner />
          <span className="heading-font text-grayscale-100">
            Calculating score...
          </span>
        </div>
      )}
      <div className="w-full max-w-[1080px] px-4 md:px-8 lg:px-16 @min-[1080px]:px-0 mt-16">
        <div>
          <h1 className="title-font text-grayscale-900 mb-4">
            Your Score: {correctAnswers.length}/{quiz.questions.length}
          </h1>
          <p className="body-font text-grayscale-900 mb-6">
            {aiFeedback && aiFeedback.feedback}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {quiz.questions.map((q, i) => (
            <div key={i}>
              <h2 className="heading-font text-grayscale-900 mb-2">
                Question {i + 1}
              </h2>
              <p className="body-font text-grayscale-900 mb-4">{q.question}</p>
              <p
                className={`py-4 rounded-lg border text-center font-oswald text-grayscale-900 text-lg ${getAnswerClass(q, answers[i])}`}
              >
                {answers[i]}
              </p>
              {q.answer !== answers[i] && (
                <p className="body-font mt-2">
                  <span className="font-bold">Correct answer: </span>
                  {q.answer}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="heading-font text-grayscale-900">What to Review</h2>
          <p className="body-font text-grayscale-900 mt-4">
            {aiFeedback && aiFeedback.review}
          </p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 w-full mt-30">
          <ButtonInput onClick={exitQuiz} variant="secondary">
            Exit
          </ButtonInput>
          <ButtonInput
            onClick={handleDownloadResultsPDF}
            variant="primary"
            className={`col-start-3 lg:col-start-4 ${downloadingPDF ? "opacity-50" : ""}`}
          >
            {downloadingPDF ? "Generating..." : "Download results"}
          </ButtonInput>
        </div>
      </div>{" "}
    </div>
  );
};

export default Score;
