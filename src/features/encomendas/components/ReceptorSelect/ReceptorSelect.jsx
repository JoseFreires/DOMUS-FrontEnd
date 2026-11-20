"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./ReceptorSelect.module.css";


export default function ReceptorSelect({
  grupos = [],
  value,
  onChange,
  titulo = "Escolha o receptor",
  label = "Receptor",
  placeholder = "Selecione o receptor",
  isLoading = false,
  isDisabled = false,
  textoVazio = "Nenhuma pessoa cadastrada",
}) {
  const [aberto, setAberto] = useState(false);
  const wrapperRef = useRef(null);

  const isSelecionado = (chave, id) =>
    value?.tipo === chave && String(value?.id) === String(id);

  const selecionado = grupos
    .flatMap((g) => g.itens.map((item) => ({ ...item, chave: g.chave })))
    .find((item) => isSelecionado(item.chave, item.value));

  // fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!aberto) return;

    const handleClickFora = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setAberto(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation(); // não fecha o modal junto
        setAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    document.addEventListener("keydown", handleEsc, true);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("keydown", handleEsc, true);
    };
  }, [aberto]);

  const handleSelecionar = (chave, item) => {
    onChange?.({ tipo: chave, id: item.value, label: item.label });
    setAberto(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Campo (mesmo visual do Dropdown atual) */}
      <button
        type="button"
        className={`${styles.trigger} ${aberto ? styles.triggerOpen : ""}`}
        onClick={() => setAberto((prev) => !prev)}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={aberto}
      >
        <span className={styles.triggerText}>
          {selecionado && <span className={styles.label}>{label}</span>}
          <span className={selecionado ? styles.valor : styles.placeholder}>
            {selecionado ? selecionado.label : placeholder}
          </span>
        </span>
        <FiChevronDown
          size={20}
          className={`${styles.chevron} ${aberto ? styles.chevronOpen : ""}`}
        />
      </button>

      {/* Painel do design */}
      {aberto && (
        <div className={styles.panel} role="listbox" aria-label={titulo}>

          <div className={styles.panelBody}>
            {isLoading ? (
              <p className={styles.vazio}>Carregando...</p>
            ) : (
              grupos.map((grupo) => (
                <div key={grupo.chave} className={styles.grupo}>
                  <div className={styles.grupoTitulo}>
                    <span className={styles.triangulo} aria-hidden="true" />
                    {grupo.titulo}
                  </div>

                  {grupo.itens.length === 0 ? (
                    <p className={styles.vazio}>{textoVazio}</p>
                  ) : (
                    grupo.itens.map((item) => {
                      const ativo = isSelecionado(grupo.chave, item.value);
                      return (
                        <button
                          key={`${grupo.chave}:${item.value}`}
                          type="button"
                          role="option"
                          aria-selected={ativo}
                          className={`${styles.item} ${ativo ? styles.itemAtivo : ""}`}
                          onClick={() => handleSelecionar(grupo.chave, item)}
                        >
                          {item.label}
                        </button>
                      );
                    })
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}