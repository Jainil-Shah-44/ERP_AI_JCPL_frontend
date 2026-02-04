"use client";

import clsx from "clsx";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  name: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export default function Select({
  label,
  name,
  value,
  options,
  placeholder = "Select option",
  onChange,
  required = false,
  disabled = false,
  error,
  className,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          "w-full rounded-lg border px-3 py-2 text-sm text-gray-700",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1",
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
          disabled && "bg-gray-100 cursor-not-allowed opacity-75",
          className
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}