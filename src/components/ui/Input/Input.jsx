// components/Input/Input.jsx
"use client";

import styles from "./Input.module.css";
import { useState } from "react";

export default function Input({
  type,
  name,
  variant = "Default",
  placeholder,
  inputClassName,
  Label,
  value,
  defaultValue,
  icon,
  onChange,
  disabled,
  error,
}) {
  const variants = {
    Default: styles.default,
    Active: styles.active,
    Error: styles.error,
    Disabled: styles.disabled,
  };

  const [currentVariant, setCurrentVariant] = useState(variant);
  const [showError, setShowError] = useState(false);

  const message = error || (showError ? "Este campo é obrigatório." : "");
  const activeVariant = error ? "Error" : currentVariant;
  const id = name ?? "floatingInput";
  const isControlled = value !== undefined;

  return (
    <div className={`${styles.field} ${error ? styles.fieldWithError : ""}`}>
      <div className="form-floating mb-2">
        <input
          type={type}
          name={name}
          className={`form-control rounded-3 w-100${inputClassName ?? ""} ${variants[activeVariant]}`}
          id={id}
          placeholder={placeholder}
          aria-invalid={!!message}
          aria-describedby={message ? `${id}-error` : undefined}
          onFocus={() => setCurrentVariant("Active")}
          onBlur={(e) => {
            if (e.target.value) {
              setShowError(false);
              setCurrentVariant("Default");
            } else {
              setShowError(true);
              setCurrentVariant("Error");
            }
          }}
          {...(isControlled ? { value } : { defaultValue })}
          onChange={(e) => {
            onChange?.(e);
            if (currentVariant === "Default" || currentVariant === "Error") {
              setCurrentVariant("Active");
            }
          }}
          disabled={disabled}
        />
        <label htmlFor={id} className={styles.texto}>
          {Label}
        </label>
      </div>
      {message && (
        <div
          id={`${id}-error`}
          className={error ? styles.errorInline : styles.errorMessage}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
}
