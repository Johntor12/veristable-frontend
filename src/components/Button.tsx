import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react"; // Import ReactNode

type ButtonProps = {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  fullW?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children?: ReactNode; // Add children prop
};

export default function Button({
  variant = "default",
  size = "default",
  fullW = false,
  disabled = false,
  className = "",
  onClick = () => {},
  children, // Accept children
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(fullW && "w-full", className)}
    >
      {children} {/* Render children */}
    </ShadcnButton>
  );
}
