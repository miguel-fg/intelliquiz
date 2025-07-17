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
  clearQuizStorage,
  loadQuizFromStorage,
  saveQuizToStorage,
} from "../scripts/localStorage";

interface QuizContextType {
  quiz: QuizState;
  setQuiz: React.Dispatch<React.SetStateAction<QuizState>>;
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

  useEffect(() => {
    if (typeof quiz === "object" && quiz !== null) {
      saveQuizToStorage(quiz);
    }
  });

  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
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
    context.setQuiz(null);
  };

  const setDefault = () => {
    context.setQuiz(sampleQuiz);
  };

  return { ...context, clear, setDefault };
};

export default QuizContextProvider;
