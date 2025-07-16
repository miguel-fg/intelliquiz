import { FC } from "react";

interface Props {
  value: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
}

const RadioInput: FC<Props> = ({ value, name, checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="radio"
        className="sr-only"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span
        className={`w-5 h-5 rounded-full border-2 transition-colors ${
          checked ? "border-primary-600" : "border-grayscale-400"
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
