import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  control: Control<any>;
  options: Option[];
  error?: FieldError;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  control,
  options,
  error,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="mx-label">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            disabled={disabled}
            className="mx-select"
          >
            <option value="">Seleccione una opción</option>

            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />

      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};