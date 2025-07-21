import { FC, ReactNode } from "react";
import clsx from "clsx";

interface Props {
  variant?:
    | "primary"
    | "outline"
    | "secondary"
    | "cancel"
    | "danger"
    | "success";
  className?: string;
  disabled?: boolean;
  children: ReactNode;
  onClick: () => void;
}

const ButtonInput: FC<Props> = ({
  variant = "primary",
  className,
  children,
  onClick,
}) => {
  const baseClass = "px-4 py-2 rounded rounded-sm font-oswald cursor-pointer";

  const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
    primary:
      "bg-primary-500 text-grayscale-100 hover:bg-primary-600 active:bg-primary-700",
    outline:
      "bg-white border-2 border-primary-500 text-primary-600 hover:bg-grayscale-100 active:bg-grayscale-200 active:border-primary-700 active:text-primary-700",
    secondary:
      "bg-grayscale-400 text-grayscale-900 hover:bg-grayscale-500 active:bg-grayscale-600 active:text-grayscale-200",
    danger:
      "bg-error-600 text-grayscale-100 hover:bg-error-700 active:bg-error-800 active:text-grayscale-200",
    success:
      "bg-success-600 text-grayscale-100 hover:bg-success-700 active:bg-success-800 active:text-grayscale-200",
    cancel:
      "bg-grayscale-800 text-grayscale-100 hover:bg-grayscale-900 active:bg-black active:text-grayscale-200",
  };

  const buttonClass = clsx(baseClass, variantClasses[variant], className);

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default ButtonInput;
