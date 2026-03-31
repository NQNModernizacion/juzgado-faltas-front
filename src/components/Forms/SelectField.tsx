import React from "react";
import { Control, FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  control: Control<any>;
  options: Option[];
  error?: FieldError;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  control,
  options,
  error,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="block mb-1 text-sm font-semibold text-blue-800">
        {label}
      </label>
      <select
        {...control}
        disabled={disabled}
        className={`border border-gray-300 rounded-md px-3 py-2 w-full text-sm ${
          error ? "border-red-500" : ""
        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
      >
        <option value="">Seleccione un tipo</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

