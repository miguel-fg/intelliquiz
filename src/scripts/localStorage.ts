import { QuizJsonResponse } from "../types/quiz";

const QUIZ_KEY = "savedQuiz";
const ANS_KEY = "savedAnswers";

export const saveQuizToStorage = (quiz: QuizJsonResponse) => {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(quiz));
};

export const saveAnswersToStorage = (answers: Record<number, string>) => {
  localStorage.setItem(ANS_KEY, JSON.stringify(answers));
};

export const loadQuizFromStorage = (): QuizJsonResponse | null => {
  const saved = localStorage.getItem(QUIZ_KEY);

  if (!saved) return null;

  try {
    return JSON.parse(saved) as QuizJsonResponse;
  } catch (error) {
    console.error("Failed to parse saved quiz: ", error);
    return null;
  }
};

export const loadAnswersFromStorage = (): Record<number, string> => {
  const saved = localStorage.getItem(ANS_KEY);

  if (!saved) return {};

  try {
    return JSON.parse(saved) as Record<number, string>;
  } catch (error) {
    console.error("Failed to parse saved answers: ", error);
    return {};
  }
};

export const clearQuizStorage = () => {
  localStorage.removeItem(QUIZ_KEY);
};

export const clearAnswerStorage = () => {
  localStorage.removeItem(ANS_KEY);
};
