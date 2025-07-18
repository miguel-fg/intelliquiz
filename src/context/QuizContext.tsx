import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { QuizState } from "../types/quiz";
import sampleQuiz from "../assets/sampleQuiz";
import {
  clearAnswerStorage,
  clearQuizStorage,
  clearFeedbackStorage,
  loadQuizFromStorage,
  saveQuizToStorage,
} from "../scripts/localStorage";

interface QuizContextType {
  quiz: QuizState;
  setQuiz: React.Dispatch<React.SetStateAction<QuizState>>;
  answers: Record<number, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

export const QuizContext = createContext<QuizContextType | null>(null);

interface ContextProps {
  defaultQuiz?: QuizState;
  children: ReactNode;
}

const QuizContextProvider = ({
  defaultQuiz = null,
  children,
}: ContextProps) => {
  const [quiz, setQuiz] = useState<QuizState>(() => {
    const local = loadQuizFromStorage();
    return local ?? defaultQuiz;
  });
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (typeof quiz === "object" && quiz !== null) {
      saveQuizToStorage(quiz);
    }
  });

  return (
    <QuizContext.Provider value={{ quiz, setQuiz, answers, setAnswers }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType & {
  clear: () => void;
  setDefault: () => void;
} => {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz must be used inside a QuizContextProvider");
  }

  const clear = () => {
    clearQuizStorage();
    clearAnswerStorage();
    clearFeedbackStorage();
    context.setQuiz(null);
    context.setAnswers({});
  };

  const setDefault = () => {
    context.setQuiz(sampleQuiz);
  };

  return { ...context, clear, setDefault };
};

export default QuizContextProvider;
