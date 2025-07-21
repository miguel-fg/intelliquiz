import { FC, KeyboardEvent } from "react";

interface Props {
  value: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
}

const RadioInput: FC<Props> = ({ value, name, checked, onChange, label }) => {
  const id = `${name}-${value}`;

  const handleKeyUp = (event: KeyboardEvent) => {
    event.preventDefault();

    if (event.key === "Enter" || event.key === " ") {
      onChange(value);
    }
  };

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer select-none focus:outline-none focus:ring-2 ring-primary-500 p-2 rounded"
      tabIndex={0}
      onKeyUp={handleKeyUp}
    >
      <input
        id={id}
        type="radio"
        className="sr-only"
        tabIndex={-1}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span
        className={`w-5 h-5 rounded-full border transition-colors bg-grayscale-200 ${
          checked ? "border-primary-600 bg-transparent" : "border-grayscale-400"
        } flex items-center justify-center`}
      >
        {checked && (
          <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
        )}
      </span>
      <span className="text-grayscale-900 body-font">{label}</span>{" "}
    </label>
  );
};

export default RadioInput;
