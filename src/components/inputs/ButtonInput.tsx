import { FC, ReactNode } from "react";

interface Props {
  variant?: "primary" | "secondary" | "cancel" | "danger" | "success";
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}

const ButtonInput: FC<Props> = ({
  variant = "primary",
  className,
  children,
}) => {
  let btnClass: string;
  switch (variant) {
    case "primary":
      return "bg-primary-500 text-grayscale-100";
  }

  return <button>{children}</button>;
};

export default ButtonInput;
