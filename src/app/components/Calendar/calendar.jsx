import { useState } from "react";

import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

export default function Calendar() {
  const [selected, setSelected] = useState(undefined);

  return (
    <DayPicker
      animate
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        selected ? `Data selecionada: ${selected.toLocaleDateString()}` : "Escolha um dia de reserva"
      }
    />
  );
}