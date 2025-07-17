import { FC } from "react";
import ButtonInput from "./inputs/ButtonInput";

interface Cover {
  title: string;
  description: string;
  estTime: string;
  numQuestions: number;
  typeQuestions: string;
}
interface Props {
  cover: Cover;
  onStart: () => void;
  onExit: () => void;
}

export const QuizCover: FC<Props> = ({ cover, onStart, onExit }) => {
  const questionTypes = {
    mcq: "Multiple Choice",
    "t/f": "True or false",
    open: "Open Ended",
    mixed: "Multiple Choice, True or false, and Open Ended",
  };
  return (
    <>
      <div>
        <h1 className="title-font text-grayscale-900">{cover.title}</h1>
        <p className="body-font text-grayscale-900">{cover.description}</p>
        <br />
        <p className="body-font text-grayscale-900 mt-4 md:mt-8 mb-2">
          <span className="font-bold">Number of questions: </span>
          {cover.numQuestions}
        </p>
        <p className="body-font text-grayscale-900 mb-2">
          <span className="font-bold">Type of questions: </span>
          {questionTypes[cover.typeQuestions as keyof typeof questionTypes]}
        </p>
        <p className="body-font text-grayscale-900">
          <span className="font-bold">Estimated Completion Time: </span>
          {cover.estTime}
        </p>
      </div>{" "}
      <div className="grid grid-cols-3 lg:grid-cols-4 w-full mt-4 md:mt-8">
        <ButtonInput onClick={onExit} variant="danger">
          Exit
        </ButtonInput>
        <ButtonInput
          onClick={onStart}
          variant="primary"
          className="col-start-3 lg:col-start-4"
        >
          Start quiz
        </ButtonInput>
      </div>{" "}
    </>
  );
};

export default QuizCover;
