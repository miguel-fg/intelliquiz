import { FC } from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: "mcq" | "open" | "t/f" | "mixed") => void;
  options: Option[];
  placeholder?: string;
}

const SelectInput: FC<Props> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="body-font text-grayscale-900">
        {label}:{" "}
      </label>
      <select
        name={id}
        id={id}
        value={value}
        onChange={(e) =>
          onChange(e.target.value as "mcq" | "open" | "t/f" | "mixed")
        }
        className="bg-white rounded-sm border border-grayscale-400 focus:outline-none focus:ring-2 focus:ring-primary-500 px-2 py-0.5 body-font text-grayscale-900 min-w-28"
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option value={opt.value} key={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
