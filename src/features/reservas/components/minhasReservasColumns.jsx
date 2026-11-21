import Badge from "react-bootstrap/Badge";

export const STATUS_RESERVA = {
  CONFIRMADA: { bg: "success", label: "Confirmada" },
  RESERVADA: { bg: "warning", label: "Pendente" },
  PENDENTE: { bg: "warning", label: "Pendente" },
  NEGADA: { bg: "danger", label: "Negada" },
  RECUSADA: { bg: "danger", label: "Recusada" },
  CANCELADA: { bg: "secondary", label: "Cancelada" },
};

export const formatarDataISO = (iso) => {
  const [a, m, d] = String(iso ?? "").split("-");
  return a && m && d ? `${d}/${m}/${a}` : "";
};

export const formatarDataHora = (valor) => {
  if (!valor) return "";
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("pt-BR");
};

export function prepararMinhasReservas(reservas = []) {
  return reservas.map((r) => ({
    ...r,
    dataReservaFormatada: formatarDataISO(r.dataReserva),
    criadaEmFormatada: formatarDataHora(r.criadaEm),
    statusLabel: STATUS_RESERVA[r.statusReserva]?.label ?? r.statusReserva ?? "",
    observacao: r.canceladaEm
      ? `Cancelada em ${formatarDataHora(r.canceladaEm)}`
      : r.justificativaReservaNegada || "",
  }));
}

export const minhasReservasColumns = [
  { key: "nomeEspaco", label: "Espaço" },
  { key: "dataReservaFormatada", label: "Data da reserva" },
  { key: "quantidadeConvidados", label: "Convidados" },
  {
    key: "statusLabel",
    label: "Status",
    render: (_valor, row) => {
      const status = STATUS_RESERVA[row.statusReserva] ?? {
        bg: "secondary",
        label: row.statusReserva ?? "—",
      };
      return <Badge bg={status.bg}>{status.label}</Badge>;
    },
  },
  { key: "criadaEmFormatada", label: "Solicitada em" },
  {
    key: "observacao",
    label: "Observação",
    render: (valor, row) =>
      row.justificativaReservaNegada && !row.canceladaEm ? (
        <span className="text-danger">{valor}</span>
      ) : (
        valor || "—"
      ),
  },
];