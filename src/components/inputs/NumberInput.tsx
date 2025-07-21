import { FC } from "react";

interface Props {
  label: string;
  id: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

const NumberInput: FC<Props> = ({
  label,
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
}) => {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="body-font text-grayscale-900">
        {label}:{" "}
      </label>
      <input
        type="number"
        className="bg-white rounded-sm border border-grayscale-400 focus:outline-none focus:ring-2 focus:ring-primary-500 px-2 py-0.5 body-font text-grayscale-900 min-w-20"
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
      />
    </div>
  );
};

export default NumberInput;
