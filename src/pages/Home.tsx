import { useState } from "react";
import RadioInput from "../components/inputs/RadioInput";
import TextAreaInput from "../components/inputs/TextAreaInput";
import FileInput from "../components/inputs/FileInput";
import NumberInput from "../components/inputs/NumberInput";
import SelectInput from "../components/inputs/SelectInput";
import ButtonInput from "../components/inputs/ButtonInput";

function Home() {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [typeQuestions, setTypeQuestions] = useState<
    "mcq" | "open" | "t/f" | "mixed"
  >("mixed");
  const typeOptions = [
    { label: "Multiple Choice", value: "mcq" },
    { label: "Open Answer", value: "open" },
    { label: "True / False", value: "t/f" },
    { label: "Mixed", value: "mixed" },
  ];

  return (
    <div className="flex justify-center w-full @container">
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
        <div className="flex justify-center md:grid md:grid-cols-3 w-full mt-6">
          <ButtonInput className="col-span-1 col-start-2">
            Generate Quiz
          </ButtonInput>
        </div>
      </div>
    </div>
  );
}

export default Home;
