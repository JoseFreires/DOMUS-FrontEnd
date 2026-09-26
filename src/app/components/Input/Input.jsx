// components/Input/Input.jsx
"use client";

import styles from "./input.module.css";
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
}) {
  const variants = {
    Default: styles.default,
    Active: styles.active,
    Error: styles.error,
    Disabled: styles.disabled,
  };

  const [currentVariant, setCurrentVariant] = useState(variant);
  const [showError, setShowError] = useState(false);

  const isControlled = value !== undefined;

  return (
    <div className="form-floating mb-4">
      <input
        type={type}
        name={name}
        className={`form-control rounded-3 w-100 ${inputClassName} ${variants[currentVariant]}`}
        id={name ?? "floatingInput"}
        placeholder={placeholder}
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
        <label htmlFor={name ?? "floatingInput"} className={styles.texto}>
                {Label}
        </label>

        {showError && (<div className={styles.errorMessage}>Este campo é obrigatório.</div>)}
    </div>
  );
}