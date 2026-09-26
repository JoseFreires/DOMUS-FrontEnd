import { useState, useEffect } from "react";

import { DayPicker, getDefaultClassNames } from "@daypicker/react";
import { ptBR } from "react-day-picker/locale";
import "@daypicker/react/style.css";

export default function Calendar({ onDateSelect }) {
 const [selected, setSelected] = useState(new Date());
  const defaultClassNames = getDefaultClassNames();

  useEffect(() => {
    onDateSelect?.(selected);
  }, []); // dispara uma vez, ao montar

  function handleSelect(date) {
    setSelected(date);
    onDateSelect?.(date);
  }

  return (
    <DayPicker
      animate
      locale={ptBR}
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      classNames={{
        root: `${defaultClassNames.root} shadow-lg p-5`,
        chevron: `${defaultClassNames.chevron} fill-amber-500`,
      }}
    />
  );
}