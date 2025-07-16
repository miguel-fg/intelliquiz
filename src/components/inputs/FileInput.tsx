import React, { FC, useRef, useState } from "react";
import DocumentIcon from "../icons/DocumentIcon";

interface Props {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

const FileInput: FC<Props> = ({
  onFileSelected,
  accept = ".pdf, .docx, .txt",
  maxSizeMB = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMB}MB limit. Current size ${file.size}`);
      return;
    }

    setError("");
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col w-full justify-center items-center border-2 border-dashed cursor-pointer transition-colors h-45 rounded-md ${isDragging ? "border-primary-500 bg-primary-200" : "border-grayscale-400 hover:border-primary-400"}`}
    >
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <span className="text-primary-500">
        <DocumentIcon />
      </span>
      <p className="font-oswald text-lg text-grayscale-600">
        Drop files here or{" "}
        <span
          className="cursor-pointer text-info-400 underline"
          onClick={() => fileInputRef.current?.click()}
        >
          browse
        </span>
      </p>
      {error && <p className="text-error-500 mt-2 body-font">{error}</p>}
    </div>
  );
};

export default FileInput;
