import Badge from "react-bootstrap/Badge";
import {
  STATUS_RESERVA,
  formatarDataISO,
  formatarDataHora,
} from "./minhasReservasColumns";

export function prepararSolicitacoes(lista = []) {
  return lista.map((r) => ({
    ...r,
    morador: r.nomeMorador ?? r.nomeCompleto ?? "",
    dataReservaFormatada: formatarDataISO(r.dataReserva),
    criadaEmFormatada: formatarDataHora(r.criadaEm),
    statusLabel: STATUS_RESERVA[r.statusReserva]?.label ?? r.statusReserva ?? "",
  }));
}

export const solicitacoesReservasColumns = [
  { key: "nomeMorador", label: "Morador" },
  { key: "nomeEspaco", label: "Espaço" },
  { key: "dataReservaFormatada", label: "Data da reserva" },
  { key: "quantidadeConvidados", label: "Convidados" },
  {
    key: "statusLabel",
    label: "Status",
    render: (_v, row) => {
      const s = STATUS_RESERVA[row.statusReserva] ?? { bg: "secondary", label: row.statusReserva ?? "—" };
      return <Badge bg={s.bg}>{s.label}</Badge>;
    },
  },
  { key: "criadaEmFormatada", label: "Solicitada em" },
];