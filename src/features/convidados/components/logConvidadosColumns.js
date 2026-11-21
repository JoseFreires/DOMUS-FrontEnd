const formatarDataHora = (valor) => {
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("pt-BR");
};

const dataLocalISO = (valor) => {
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("sv-SE");
};

export function prepararLogs(logs = []) {
  return logs.map((l) => ({
    ...l,
    dataHoraFormatada: formatarDataHora(l.dataHoraChegada),
    dataLocal: dataLocalISO(l.dataHoraChegada),
  }));
}

export function filtrarLogsPorPeriodo(linhas, { startDate, endDate } = {}) {
  return linhas.filter((l) => {
    if (startDate && l.dataLocal < startDate) return false;
    if (endDate && l.dataLocal > endDate) return false;
    return true;
  });
}

export const logConvidadosColumns = [
  { key: "nomeConvidado", label: "Convidado" },
  { key: "nomePorteiro", label: "Registrado por" },
  { key: "dataHoraFormatada", label: "Chegada" },
  { key: "nomeMorador", label: "Morador" },
  { key: "recorrencia", label: "Recorrência" },
];