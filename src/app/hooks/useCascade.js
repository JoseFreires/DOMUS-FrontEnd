import { useState, useEffect } from "react";
import { applyMask } from "./applyMask";

export function useCascade(fields, initialData, active) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!active) return;

    let base = initialData || {};

    fields.forEach((field) => {
      if (field.dependedsOn && base[field.name] != null) {
        const selected =
          field.options ||
          [].find((opt) => String(opt.value) === String(base[field.name]));
        const parentKey = field.filterField || field.dependedsOn;
        if (selected && selected[parentKey] != undefined) {
          base = { ...base, [field.dependedsOn]: selected[parentKey] };
        }
      }
    });
    setFormData(base);
  }, [fields, initialData, active]);

    const handleChange = (fieldName, maskName) => (e) => {
        const rawValue = e.target.value;
        const value = maskName ? applyMask(maskName, rawValue) : rawValue;
 
        setFormData((prev) => {
            const next = { ...prev, [fieldName]: rawValue };
 
            fields.forEach((f) => {
                if (f.dependsOn === fieldName) {
                    next[f.name] = "";
                }
            });
 
            return { ...prev, [fieldName]: value };
        });
    };
    
    const getFieldOptions = (field) => {
    if (!field.dependsOn) return field.options || [];

    const parentValue = formData[field.dependsOn];
    if (!parentValue) return []; // nada selecionado no pai ainda

    return (field.options || []).filter(
      (opt) =>
        String(opt[field.filterField || "parentId"]) === String(parentValue),
    );
  };

  // Útil para o placeholder/disabled do campo filho no render
  const isFieldLocked = (field) =>
    !!field.dependsOn && !formData[field.dependsOn];

  return {
    formData,
    setFormData,
    handleChange,
    getFieldOptions,
    isFieldLocked,
  };
}
