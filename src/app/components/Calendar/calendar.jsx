import { useState } from "react";

import { DayPicker, getDefaultClassNames } from "@daypicker/react";
import { ptBR } from "react-day-picker/locale";
import "@daypicker/react/style.css";

export default function Calendar() {
  const [selected, setSelected] = useState(undefined);
  const defaultClassNames = getDefaultClassNames();

  console.log(selected)

  return (
    <DayPicker
      animate
      locale={ptBR}
      mode="single"
      selected={selected}
      onSelect={setSelected}
      classNames={{
        root: `${defaultClassNames.root} shadow-lg p-5`, 
        chevron: `${defaultClassNames.chevron} fill-amber-500`,
      }}
    />
  );
}