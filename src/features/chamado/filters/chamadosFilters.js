import { isWithinDateRange, parseItemDate } from "@/utils/dateUtils.js";
 
export const NAV_ITENS_CHAMADOS = [
  { texto: "Abertos" },
  { texto: "Cancelados" },
];
 
function normalizeValue(value) {
  return value
    ?.normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[_-]/g, " ")
    .trim()
    .toUpperCase() ?? "";
}
 
// Rótulos exibidos no filtro (as chaves são os valores normalizados, sem acento)
const TYPE_LABELS = {
  SUGESTAO: "Sugestão",
  RECLAMACAO: "Reclamação",
  INCIDENTE: "Incidente",
  DUVIDAS: "Dúvidas",
};
 
// Ordem do fluxo do chamado
const STATUS_LABELS = {
  ABERTO: "Aberto",
  TRATANDO: "Tratando",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};
 
// Sinônimos que o backend pode devolver
const STATUS_ALIASES = {
  PENDENTE: "ABERTO",
  FINALIZADO: "CONCLUIDO",
  RESOLVIDO: "CONCLUIDO",
};
 
function capitalize(value) {
  return value ? value.charAt(0) + value.slice(1).toLowerCase() : value;
}
 
function getResidentName(item) {
  return item.nomeMorador ?? item.nomeCompleto ?? "";
}
 
function getCalledType(item) {
  return normalizeValue(item.tipoChamado ?? item.tipo);
}
 
function getCalledStatus(item) {
  const status = normalizeValue(item.statusChamado ?? item.status);
  return STATUS_ALIASES[status] ?? status;
}
 
function getCalledDate(item) {
  return (
    item.dataHoraAbertura ??
    item.dataHoraCriacao ??
    item.dataCriacao ??
    item.dataHoraChamado ??
    item.datadecriação
  );
}
 
const TAB_FILTERS = {
  Abertos: () => true,
  Tratando: (item) => getCalledStatus(item) === "TRATANDO",
  Concluidos: (item) => getCalledStatus(item) === "CONCLUIDO",
  Cancelados: (item) => getCalledStatus(item) === "CANCELADO",
};
 
// Remove repetidos e monta { value, label } (formato aceito pelo Filtro)
function buildOptions(values, labels) {
  return Array.from(new Set(values.filter(Boolean))).map((value) => ({
    value,
    label: labels[value] ?? capitalize(value),
  }));
}
 
export function extractFilterChamadosUsers(data) {
  return Array.from(
    new Set((data ?? []).map(getResidentName).filter(Boolean)),
  ).sort();
}
 
// Tipos conhecidos + qualquer outro tipo que venha da API
export function extractFilterChamadosTypes(data) {
  return buildOptions(
    [...Object.keys(TYPE_LABELS), ...(data ?? []).map(getCalledType)],
    TYPE_LABELS,
  ).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}
 
// Status conhecidos (na ordem do fluxo) + qualquer outro status que venha da API
export function extractFilterChamadosStatuses(data) {
  return buildOptions(
    [...Object.keys(STATUS_LABELS), ...(data ?? []).map(getCalledStatus)],
    STATUS_LABELS,
  );
}
 
export function filterChamados(data, activeTab = "Todos", filters = {}) {
  const tabFilter = TAB_FILTERS[activeTab] ?? TAB_FILTERS.Todos;
  const {
    selectedUsers = [],
    selectedTypes = [],
    selectedStatuses = [],
  } = filters;
 
  return (data ?? [])
    .filter(tabFilter)
    .filter((item) => {
      if (selectedUsers.length && !selectedUsers.includes(getResidentName(item))) {
        return false;
      }
 
      if (selectedTypes.length && !selectedTypes.includes(getCalledType(item))) {
        return false;
      }
 
      if (
        selectedStatuses.length &&
        !selectedStatuses.includes(getCalledStatus(item))
      ) {
        return false;
      }
 
      return isWithinDateRange(parseItemDate(getCalledDate(item)), filters);
    });
}