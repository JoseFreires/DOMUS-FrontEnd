import { useState, useCallback } from "react";

export function useEntityModal({ onCreate, onUpdate, getId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState(null); // "add" | "edit" | string customizada
  const [itemData, setItemData] = useState(null);

  const close = useCallback(() => {
    setOpen(false);
    setTipo(null);
    setItemData(null);
  }, []);

  const openAdd = useCallback(() => {
    setItemData(null);
    setTipo("add");
    setOpen(true);
  }, []);

  const openEdit = useCallback((row) => {
    setItemData(row);
    setTipo("edit");
    setOpen(true);
  }, []);

  const save = useCallback(
    async (formData) => {
      if (tipo === "edit" && itemData) {
        const id = getId?.(itemData);
        if (id === undefined || id === null) {
          throw new Error("Não foi possível identificar o registro a ser atualizado.");
        }
        await onUpdate(id, formData);
      } else {
        await onCreate(formData);
      }

      try {
        await onRefresh?.();
      } catch (err) {
        console.error("Salvo, mas não foi possível atualizar a lista:", err);
      }

      close();
    },
    [tipo, itemData, getId, onCreate, onUpdate, onRefresh, close]
  );

  return { open, tipo, itemData, openAdd, openEdit, close, save, setTipo };
}