export function pegarIniciais(nomeCompleto) {
  const limpo = nomeCompleto.trim();

  const partes = limpo.split(' ');

  const primeiraLetra = partes[0].charAt(0);

  const ultimaLetra = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';

  return (primeiraLetra + ultimaLetra).toUpperCase();
}