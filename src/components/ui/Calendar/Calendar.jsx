import { useState, useEffect, useMemo } from "react";
import { DayPicker, getDefaultClassNames } from "@daypicker/react";
import { ptBR } from "react-day-picker/locale";
import "@daypicker/react/style.css";

import { primeiraDataPermitida } from "@/utils/datasReserva";

export default function Calendar({
  onDateSelect,
  minHorasAntecedencia = 0,   // 48 na visão do morador; 0 = sem bloqueio (só impede o passado)
}) {
  const defaultClassNames = getDefaultClassNames();

  const minDate = useMemo(
    () => primeiraDataPermitida(minHorasAntecedencia),
    [minHorasAntecedencia]
  );

  // começa no primeiro dia permitido (e não em "hoje", que pode estar bloqueado)
  const [selected, setSelected] = useState(minDate);

  useEffect(() => {
    onDateSelect?.(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // avisa o pai da data inicial, uma vez

  function handleSelect(date) {
    if (!date) return; // clicar na data já selecionada não deve "desmarcar"
    setSelected(date);
    onDateSelect?.(date);
  }

  return (
    <DayPicker
      animate
      locale={ptBR}
      mode="single"
      required
      selected={selected}
      onSelect={handleSelect}
      disabled={{ before: minDate }}
      startMonth={minDate}        // não deixa navegar para meses totalmente bloqueados
      defaultMonth={selected}
      classNames={{
        root: `${defaultClassNames.root} shadow-lg p-5`,
        chevron: `${defaultClassNames.chevron} fill-amber-500`,
      }}
    />
  );
}