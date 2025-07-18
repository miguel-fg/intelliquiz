import { useNavigate, useParams } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import QuizCover from "../components/QuizCover";
import ButtonInput from "../components/inputs/ButtonInput";
import { useEffect, useState } from "react";
import { saveAnswersToStorage } from "../scripts/localStorage";

const Quiz = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { quiz, clear, answers, setAnswers } = useQuiz();

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  useEffect(() => {
    if (!params.quizId || !quiz || quiz === "loading" || quiz === "error") {
      navigate("/oops");
    }
  }, []);

  const exitQuiz = () => {
    clear();
    navigate("/");
  };

  if (!quiz || quiz === "loading" || quiz === "error") {
    return <></>;
  }

  const currentQuestion = quiz.questions[currentIndex];

  const handleChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
    saveAnswersToStorage(answers);
  };

  const handleSubmit = () => {
    saveAnswersToStorage(answers);
    navigate(`/score/${quiz.id}`);
  };

  return (
    <div className="flex justify-center w-full @container">
      {showExitConfirmation && (
        <div className="fixed inset-0 z-10 bg-grayscale-900/75 flex justify-center items-center">
          <div className="bg-primary-700 rounded-lg border-2 border-grayscale-100 flex flex-col items-center py-4 px-3 mx-4">
            <h1 className="heading-font text-grayscale-100 mb-10">
              Exit quiz?
            </h1>
            <p className="body-font text-grayscale-100 mb-5">
              You haven't completed the quiz yet. If you exit now, your progress
              and answers will{" "}
              <span className="font-bold text-error-400">not be saved</span>.
            </p>
            <p className="body-font text-grayscale-100 mb-15">
              Are you sure you want to leave?
            </p>
            <div className="flex justify-between w-full">
              <ButtonInput
                onClick={() => setShowExitConfirmation(false)}
                variant="cancel"
              >
                Back to quiz
              </ButtonInput>
              <ButtonInput onClick={exitQuiz} variant="danger">
                Exit without saving
              </ButtonInput>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-[1080px] px-4 md:px-8 lg:px-16 @min-[1080px]:px-0 mt-32">
        {!started ? (
          <QuizCover
            cover={quiz.cover}
            onStart={() => setStarted(true)}
            onExit={() => setShowExitConfirmation(true)}
          />
        ) : (
          <div>
            <h1 className="heading-font text-grayscale-900 mb-2">
              Question {currentIndex + 1}
            </h1>
            <p className="body-font text-grayscale-900 mb-5">
              {currentQuestion.question}
            </p>

            {currentQuestion.type === "open" ? (
              <textarea
                value={answers[currentIndex] || ""}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Your answer..."
                rows={10}
                className="w-full p-2 border border-grayscale-400 rounded-md focus:otline-none focus:ring-2 focus:ring-primary-500 body-font bg-white text-grayscale-900"
              />
            ) : (
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {currentQuestion.options?.map((option, i) => (
                  <label
                    key={i}
                    className={`flex items-center justify-center py-5 md:py-8 cursor-pointer select-none rounded-lg border-2 ${answers[currentIndex] === option ? "border-primary-500 bg-primary-200" : "border-grayscale-300 hover:bg-grayscale-200 hover:border-grayscale-400"}`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name={`question-${currentIndex}`}
                      value={option}
                      checked={answers[currentIndex] === option}
                      onChange={() => handleChange(option)}
                    />
                    <span className="font-oswald text-lg">{option}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 lg:grid-cols-4 w-full mt-20">
              {currentIndex === 0 ? (
                <ButtonInput
                  onClick={() => setShowExitConfirmation(true)}
                  variant="danger"
                >
                  Exit
                </ButtonInput>
              ) : (
                <ButtonInput
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                  variant="secondary"
                >
                  Back
                </ButtonInput>
              )}

              {currentIndex === quiz.questions.length - 1 ? (
                <ButtonInput
                  onClick={handleSubmit}
                  variant="success"
                  className={`col-start-3 lg:col-start-4 ${!answers[currentIndex] ? "opacity-50 pointer-events-none" : ""}`}
                >
                  Submit
                </ButtonInput>
              ) : (
                <ButtonInput
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(quiz.questions.length - 1, prev + 1),
                    )
                  }
                  variant="primary"
                  className={`col-start-3 lg:col-start-4 ${!answers[currentIndex] ? "opacity-50 pointer-events-none" : ""}`}
                >
                  Next
                </ButtonInput>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
