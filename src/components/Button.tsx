import { useMemo } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  text?: string;
  fullW?: boolean;
  disabled?: boolean;
  customClass?: string;
  onPress?: () => void;
  onClick?: () => void;
};

export default function Button({
  variant = "primary",
  size = "sm",
  text = "Button",
  fullW = false,
  disabled = false,
  customClass = "",
  //   onPress = () => {},
  onClick = () => {},
}: ButtonProps) {
  const widthStyle = fullW ? "w-full" : "w-fit";

  const btnVariant = useMemo(() => {
    switch (variant) {
      case "primary":
        return `bg-[#420092] ${widthStyle} text-white cursor-pointer font-jakarta rounded-md border active:border-black`;
      case "secondary":
        return `bg-transparent ${widthStyle} text-[#420092] cursor-pointer rounded-md border font-jakarta text-primary-300 active:border-black`;
      default:
        return "";
    }
  }, [variant, widthStyle]);

  const btnSize = useMemo(() => {
    switch (size) {
      case "sm":
        return "px-[21px] py-[9px] text-[16px]";
      case "md":
        return "px-[30px] py-[16px]";
      case "lg":
        return "px-12 py-4";
      default:
        return "";
    }
  }, [size]);

  const buttonClasses = useMemo(() => {
    return `${btnVariant} ${btnSize} ${customClass}`.trim();
  }, [btnVariant, btnSize, customClass]);

  return (
    <button
      className={`${buttonClasses} ${
        disabled
          ? "font-jakarta font-semibold opacity-60 disabled:cursor-not-allowed"
          : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <p className="">{text}</p>
    </button>
  );
}
