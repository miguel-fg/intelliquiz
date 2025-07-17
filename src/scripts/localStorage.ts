import { QuizJsonResponse } from "../types/quiz";

const QUIZ_KEY = "savedQuiz";

export const saveQuizToStorage = (quiz: QuizJsonResponse) => {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(quiz));
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

export const clearQuizStorage = () => {
  localStorage.removeItem(QUIZ_KEY);
};
