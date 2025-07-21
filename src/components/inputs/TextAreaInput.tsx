import { FC } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const TextAreaInput: FC<Props> = ({
  value,
  onChange,
  placeholder = "Enter your text here...",
  maxLength = 5000,
}) => {
  return (
    <>
      <label htmlFor="text-input" className="sr-only"></label>
      <textarea
        className="w-full p-2 rounded-md border border-grayscale-400 focus:outline-none focus:ring-2 focus:ring-primary-500 body-font text-grayscale-900 bg-white"
        name="text-input"
        id="text-input"
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </>
  );
};

export default TextAreaInput;
