import { FC, ReactNode } from "react";
import clsx from "clsx";

interface Props {
  variant?: "primary" | "secondary" | "cancel" | "danger" | "success";
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
    secondary: "bg-grayscale-400 text-grayscale-900",
    danger: "",
    success: "",
    cancel: "",
  };

  const buttonClass = clsx(baseClass, variantClasses[variant], className);

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default ButtonInput;
