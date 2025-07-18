import { useEffect, useState } from "react";
import api from "../scripts/axiosInstance";
import { useQuiz } from "../context/QuizContext";
import RadioInput from "../components/inputs/RadioInput";
import TextAreaInput from "../components/inputs/TextAreaInput";
import FileInput from "../components/inputs/FileInput";
import NumberInput from "../components/inputs/NumberInput";
import SelectInput from "../components/inputs/SelectInput";
import ButtonInput from "../components/inputs/ButtonInput";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useLocation } from "react-router-dom";

function Home() {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [typeQuestions, setTypeQuestions] = useState<"mcq" | "t/f" | "mixed">(
    "mixed",
  );
  const [isGenDisabled, setIsGenDisabled] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const typeOptions = [
    { label: "Multiple Choice", value: "mcq" },
    { label: "True / False", value: "t/f" },
    { label: "Mixed", value: "mixed" },
  ];

  const { quiz, setQuiz, setDefault } = useQuiz();
  const location = useLocation();
  const navigate = useNavigate();

  const generateQuiz = async () => {
    console.log("Generating quiz...");
    setQuiz("loading");

    const data = {
      numQuestions,
      typeQuestions,
      textInput,
    };

    try {
      const response = await api.post("/gpt/quiz", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("SUCCESS");
      setQuiz(response.data);
    } catch (error) {
      console.error("Failed to fetch quiz. ", error);
      setQuiz("error");
    }
  };

  useEffect(() => {
    if (inputMode === "text" && !textInput) {
      setIsGenDisabled(true);
    } else if (inputMode === "file" && !uploadedFile) {
      setIsGenDisabled(true);
    } else {
      setIsGenDisabled(false);
    }
  }, [inputMode, textInput, uploadedFile]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    if (quiz === "loading") {
      setShowLoading(true);
    } else if (quiz === "error") {
      setShowLoading(false);
    } else if (quiz) {
      navigate(`/quiz/${quiz.id}`);
    }
  }, [quiz]);

  return (
    <div className="flex justify-center w-full @container">
      {showLoading && (
        <div className="fixed inset-0 z-10 bg-primary-700 flex flex-col justify-center items-center">
          <LoadingSpinner />
          <span className="heading-font text-grayscale-100">
            Generating quiz...
          </span>
        </div>
      )}
      <div className="w-full max-w-[1080px] px-4 md:px-8 lg:px-16 @min-[1080px]:px-0 mt-16">
        <h1 className="heading-font text-grayscale-900 mb-2">
          Generate quiz from...
        </h1>
        <div className="flex items-center justify-around body-font text-grayscale-900 mb-6">
          <RadioInput
            name="input-mode"
            value="text"
            label="Text Input"
            checked={inputMode === "text"}
            onChange={(v) => setInputMode(v as "text" | "file")}
          />
          <RadioInput
            name="input-mode"
            value="file"
            label="File Upload"
            checked={inputMode === "file"}
            onChange={(v) => setInputMode(v as "text" | "file")}
          />
        </div>
        <div className="body-font text-grayscale-700">
          <h2 className="font-oswald text-lg text-grayscale-900 mb-1">
            {inputMode === "text"
              ? "Paste or type your notes"
              : "Upload a document"}
          </h2>
          {inputMode === "text" ? (
            <p>
              Paste your class notes, textbook excerpts, or any text you'd like
              to turn into a quiz. You can enter up to 5000 characters.
            </p>
          ) : (
            <>
              <p>
                Upload a <span className="font-bold underline">.txt</span>,
                <span className="font-bold underline"> .docx</span>, or{" "}
                <span className="font-bold underline">.pdf</span> file.
                <br /> You can use slides, notes, study guides, or anything with
                text content.
              </p>
              <br />
              <p>
                Max file size: 10MB <br />
                Avoid scanned documents or images. Text must be selectable
              </p>
            </>
          )}
        </div>
        <div className="mt-4">
          {inputMode === "text" && (
            <TextAreaInput
              value={textInput}
              onChange={(v) => setTextInput(v)}
              placeholder="Photosynthesis is the process by which green plants use sunlight to synthesize food from carbon dioxide and water. It generally involves the green pigment chlorophyll and generates oxygen as a byproduct..."
            />
          )}
          {inputMode === "file" && (
            <>
              <FileInput onFileSelected={setUploadedFile} />
              {uploadedFile && (
                <p className="mt-1 body-font text-grayscale-700">
                  Selected file:{" "}
                  <span className="body-font font-bold text-grayscale-900">
                    {uploadedFile.name}
                  </span>
                </p>
              )}
            </>
          )}
        </div>{" "}
        <h2 className="font-oswald text-lg text-grayscale-900 mb-1 mt-6">
          Quiz options
        </h2>
        <div className="flex flex-col justify-between md:flex-row">
          <NumberInput
            label="Number of questions"
            id="num-questions"
            value={numQuestions}
            onChange={setNumQuestions}
            min={5}
            max={30}
            step={1}
            placeholder="Enter a number"
          />
          <SelectInput
            label="Type of questions"
            id="type-questions"
            value={typeQuestions}
            onChange={setTypeQuestions}
            options={typeOptions}
          />
        </div>
        <div className="flex justify-center sm:grid sm:grid-cols-3 w-full mt-6">
          <ButtonInput
            onClick={setDefault}
            className={`col-span-1 col-start-2 w-full ${isGenDisabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            Generate Quiz
          </ButtonInput>
        </div>
      </div>
    </div>
  );
}

export default Home;
