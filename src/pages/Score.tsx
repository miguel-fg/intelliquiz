import { useState, useEffect } from "react";
import { useQuiz } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import { loadAnswersFromStorage } from "../scripts/localStorage";
import ButtonInput from "../components/inputs/ButtonInput";
import { QuizQuestion } from "../types/quiz";

const Score = () => {
  const { quiz, answers, setAnswers, clear } = useQuiz();

  const [feedback, setFeedback] = useState("");
  const [review, setReview] = useState("");

  const navigate = useNavigate();

  const correctAnswers = 0;

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

  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      const storedAnswers = loadAnswersFromStorage();
      setAnswers(storedAnswers);
    }
  }, [answers, setAnswers]);

  return (
    <div className="flex justify-center w-full @container">
      <div className="w-full max-w-[1080px] px-4 md:px-8 lg:px-16 @min-[1080px]:px-0 mt-16">
        <div>
          <h1 className="title-font text-grayscale-900 mb-4">
            Your Score: {correctAnswers}/{quiz.questions.length}
          </h1>
          <p className="body-font text-grayscale-900 mb-6">{feedback}</p>
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
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="heading-font text-grayscale-900">What to Review</h2>
          <p>{review}</p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 w-full mt-30">
          <ButtonInput onClick={exitQuiz} variant="secondary">
            Exit
          </ButtonInput>
          <ButtonInput
            onClick={() => {}}
            variant="primary"
            className="col-start-3 lg:col-start-4"
          >
            Download results
          </ButtonInput>
        </div>
      </div>{" "}
    </div>
  );
};

export default Score;
