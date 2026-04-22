import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  control: Control<any>;
  error?: FieldError;
  disabled?: boolean;
  maxLength?: number;
  transform?: (value: string) => string;
  onChange?: (value: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  control,
  error,
  disabled = false,
  maxLength,
  transform,
  onChange,
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
          <input
            type="text"
            maxLength={maxLength}
            disabled={disabled}
            value={field.value ?? ""}
            onInput={(e: any) => {
              if (transform) e.target.value = transform(e.target.value);
            }}
            onChange={(e) => {
              let value = e.target.value;

              if (transform) {
                value = transform(value);
              }

              field.onChange(value);

              if (onChange) {
                onChange(value);
              }
            }}
            onBlur={field.onBlur}
            ref={field.ref}
           className="mx-input"
          />
        )}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};