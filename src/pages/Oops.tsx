import { useNavigate } from "react-router-dom";
import ButtonInput from "../components/inputs/ButtonInput";

const Oops = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center w-full @container">
      <div className="w-full max-w-[1080px] px-4 md:px-8 lg:px-16 @min-[1080px]:px-0 mt-16">
        <h1 className="title-font text-grayscale-900 mb-1">Oops!</h1>
        <h2 className="heading-font text-grayscale-900 mb-4">
          Something went wrong!
        </h2>
        <ButtonInput onClick={() => navigate("/")}>
          Back to quiz generation
        </ButtonInput>
      </div>
    </div>
  );
};

export default Oops;
