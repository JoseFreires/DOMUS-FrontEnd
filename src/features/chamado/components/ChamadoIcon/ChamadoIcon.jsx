import {
  FiAlertTriangle,
  FiHelpCircle,
  FiMessageCircle,
  FiMoreHorizontal,
} from "react-icons/fi";
import { TfiLightBulb } from "react-icons/tfi";

// Único lugar que decide ícone e rótulo de cada tipo de chamado
// (enum TipoChamado do back-end).
const TIPOS_CHAMADO = {
  SUGESTAO: { label: "SUGESTÃO", Icon: TfiLightBulb },
  RECLAMACAO: { label: "RECLAMAÇÃO", Icon: FiMessageCircle },
  INCIDENTE: { label: "INCIDENTE", Icon: FiAlertTriangle },
  DUVIDAS: { label: "DÚVIDAS", Icon: FiHelpCircle },
  OUTROS: { label: "OUTROS", Icon: FiMoreHorizontal },
};

export function getChamadoTipo(tipo) {
  const chave = tipo
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  return TIPOS_CHAMADO[chave] ?? { label: tipo || "—", Icon: FiHelpCircle };
}

export default function ChamadoIcon({ tipo, size = 16, color = "#003366" }) {
  const { Icon } = getChamadoTipo(tipo);

  return <Icon size={size} color={color} aria-hidden="true" />;
}