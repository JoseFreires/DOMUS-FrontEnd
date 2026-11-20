export function primeiraDataPermitida(horas = 0, agora = new Date()) {
  const limite = new Date(agora.getTime() + horas * 60 * 60 * 1000);
  const inicioDoDia = new Date(limite.getFullYear(), limite.getMonth(), limite.getDate());
  // se o limite não cai exatamente à meia-noite, o dia dele já começou antes do limite
  return limite > inicioDoDia
    ? new Date(inicioDoDia.getFullYear(), inicioDoDia.getMonth(), inicioDoDia.getDate() + 1)
    : inicioDoDia;
}