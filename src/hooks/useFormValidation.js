//isso aqui é um hook para validar o envio do formulários.

"use client";

import { useState, useCallback } from "react";
import { validate } from "@/utils/validators";
//tem que criar as validações em src/utils/validators.js e passar como parâmetro para o hook, junto com os valores iniciais do formulário.

/**
 * IMPORTANTE, Para usar:
 * 
 * declare `rules` (e `initialValues`) FORA do componente, como
 * constantes de módulo — assim a referência é estável e o hook não recria
 * funções a cada render.
 *
 *   const { values, errors, handleChange, validateAll, setFieldError } =
 *     useFormValidation(INITIAL, RULES);
 */


export function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Os <Input name="..."> precisam ter `name` igual à chave em values/rules.
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Ao digitar, limpa só o erro DAQUELE campo.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  // Valida tudo de uma vez. Retorna true se ok; senão popula `errors`
  // (todos os campos inválidos aparecem juntos, não um por vez).
  const validateAll = useCallback(() => {
    const found = validate(values, rules);
    setErrors(found);
    return Object.keys(found).length === 0;
  }, [values, rules]);

  // Para erros que só o backend sabe (ex: 422 "senha fraca").
  //vai ser importante na trativa de erros do backend, que estavamos comentando
  const setFieldError = useCallback((name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
  }, []);

  return { values, errors, handleChange, validateAll, setFieldError };
}
