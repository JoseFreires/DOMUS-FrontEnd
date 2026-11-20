"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import styles from "./MoradiaMultiSelect.module.css";

/**
 * Seleção de várias moradias: Bloco → Moradia → entra na lista (com X para remover).
 *
 * value:          array de ids de moradia, ex.: [3, 7]  (é o `idMoradias` do POST /moradores)
 * onChange(ids):  recebe o novo array completo
 * blocoOptions:   [{ value, label }]
 * moradiaOptions: [{ value, label, idBloco }]
 */
export default function MoradiaMultiSelect({
  value = [],
  onChange,
  blocoOptions = [],
  moradiaOptions = [],
  disabled = false,
  isLoading = false,
  label = "Moradias",
}) {
  const [idBloco, setIdBloco] = useState("");

  const selecionados = value.map(String);

  // só moradias do bloco escolhido que ainda não estão na lista
  const moradiasDisponiveis = moradiaOptions.filter(
    (m) =>
      String(m.idBloco) === String(idBloco) &&
      !selecionados.includes(String(m.value)),
  );

  const nomeDoBloco = (id) =>
    blocoOptions.find((b) => String(b.value) === String(id))?.label;

  const textoDaMoradia = (id) => {
    const moradia = moradiaOptions.find((m) => String(m.value) === String(id));
    if (!moradia) return `Moradia #${id}`;
    const bloco = nomeDoBloco(moradia.idBloco);
    return bloco ? `${bloco} · Apto ${moradia.label}` : `Apto ${moradia.label}`;
  };

  const handleBlocoChange = (e) => setIdBloco(e.target.value);

  const handleAdicionar = (e) => {
    const id = e.target.value;
    if (!id || disabled) return;
    if (selecionados.includes(String(id))) return;   // nunca duplica
    onChange?.([...value, id]);
    // o bloco continua selecionado: facilita adicionar várias moradias do mesmo bloco
  };

  const handleRemover = (id) => {
    if (disabled) return;
    onChange?.(value.filter((v) => String(v) !== String(id)));
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.titulo}>{label}</span>

      <Dropdown
        Label="Bloco"
        placeholder="Selecione o bloco"
        options={blocoOptions}
        value={idBloco}
        onChange={handleBlocoChange}
        isLoading={isLoading}
        isDisabled={disabled}
        validateOnBlur={false}
      />

      <Dropdown
        Label="Moradia"
        placeholder={idBloco ? "Adicionar moradia" : "Selecione o bloco primeiro"}
        options={moradiasDisponiveis}
        value=""                       // sempre vazio: escolher = adicionar à lista
        onChange={handleAdicionar}
        isLoading={isLoading}
        isDisabled={disabled || !idBloco}
        validateOnBlur={false}
      />

      {value.length === 0 ? (
        <p className={styles.vazio}>Nenhuma moradia adicionada.</p>
      ) : (
        <ul className={styles.lista} aria-label="Moradias selecionadas">
          {value.map((id) => {
            const texto = textoDaMoradia(id);
            return (
              <li key={id} className={styles.chip}>
                <span>{texto}</span>
                {!disabled && (
                  <button
                    type="button"
                    className={styles.remover}
                    onClick={() => handleRemover(id)}
                    aria-label={`Remover ${texto}`}
                    title="Remover"
                  >
                    <FiX size={14} aria-hidden="true" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}