"use client";

import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react"; // optional: nice spinner

type ButtonProps = {
  children?: React.ReactNode;          // ← added
  title?: string;                      // ← optional now
  onClick?: () => void;
  variant?: "green"| "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset"; // useful for forms
};

const Button = ({
  children,
  title,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  className,
  type = "button",
}: ButtonProps) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    green: "bg-[#198754] text-white hover:bg-green-700 focus:ring-green-500",
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-300 text-black hover:bg-red-700",
    outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus:ring-gray-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const content = loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {title || "Loading..."}
    </>
  ) : (
    children || title || "Button"
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseStyle,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
    >
      {content}
    </button>
  );
};

export default Button;