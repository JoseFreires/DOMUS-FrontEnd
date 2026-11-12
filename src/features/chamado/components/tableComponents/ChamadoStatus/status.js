export function ChamadoStatus({ value }) {
  const normalizedValue = value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]/g, " ")
    .toUpperCase();
  const statuses = {
    CANCELADO: { label: "Cancelado", color: "#c62828" },
    CONCLUIDO: { label: "Concluido", color: "#1b5e20" },
    TRATANDO: { label: "Tratando", color: "#003366", outlined: true },

    ABERTO: { label: "Aberto", color: "#757575" },
  };
  const status = statuses[normalizedValue] ?? {
    label: value || "—",
    color: "#757575",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px",
        border: `1px solid ${status.color}`,
        borderRadius: 999,
        backgroundColor: status.outlined ? "#fff" : status.color,
        color: status.outlined ? status.color : "#fff",
        fontSize: 11,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: status.outlined ? status.color : "#fff",
          flexShrink: 0,
        }}
      />
      {status.label}
    </span>
  );
}