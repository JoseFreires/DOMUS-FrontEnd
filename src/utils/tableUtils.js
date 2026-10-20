// Funções puras (sem React) usadas pelo Table. Ficam separadas para serem
// fáceis de testar e de reaproveitar.

export const normalizeText = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Filtra pelo texto de busca olhando só as chaves informadas.
// Sem texto de busca, devolve os dados como vieram.
export function filterRows(data, keys, searchValue) {
  // Garante que data é sempre um array válido
  const safeData = Array.isArray(data) ? data : [];
  if (!searchValue) return safeData;
  const term = normalizeText(searchValue);
  return safeData.filter((row) =>
    keys.some((key) => normalizeText(row[key]).includes(term))
  );
}

// Recorta a página pedida. A página é "travada" entre 1 e o total, então nunca
// sobra uma página vazia (ex: depois de excluir itens ou de filtrar).
export function paginateRows(items, requestedPage, perPageRaw) {
  // Garante que items é sempre um array válido
  const safeItems = Array.isArray(items) ? items : [];
  const perPage = Math.max(1, perPageRaw || 1);
  const totalPages = Math.max(1, Math.ceil(safeItems.length / perPage));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    pageData: safeItems.slice(startIndex, endIndex),
    perPage,
    page,
    totalPages,
    from: safeItems.length ? startIndex + 1 : 0,
    to: Math.min(endIndex, safeItems.length),
  };
}

// Chave única da linha. `rowKey` pode ser o nome de um campo ("id") ou uma
// função (row, index) => chave. Sem `rowKey`, mantém a heurística antiga:
// primeiro campo cujo nome começa com "id".
export function resolveRowKey(row, index, rowKey) {
  if (typeof rowKey === "function") return rowKey(row, index);
  if (typeof rowKey === "string") return row[rowKey] ?? index;

  const idField = Object.keys(row).find((key) => key.toLowerCase().startsWith("id"));
  return idField ? row[idField] : index;
}