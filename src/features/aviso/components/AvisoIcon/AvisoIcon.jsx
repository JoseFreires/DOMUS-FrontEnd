import { FiTool } from "react-icons/fi";
import {
  MdOutlineAnnouncement,
  MdOutlineFiberNew,
  MdEventAvailable,
} from "react-icons/md";

const ICONES_POR_TIPO = {
  MANUTENCAO: FiTool,
  EVENTO: MdEventAvailable,
  AVISO: MdOutlineAnnouncement,
  COMUNICADO: MdOutlineAnnouncement,
  NOVIDADE: MdOutlineFiberNew,
};

// Único lugar que decide o ícone de cada tipo de aviso
// (antes esta função estava copiada em várias páginas).
export default function AvisoIcon({ tipo, size = 16, color = "#ffffff" }) {
  const Icon = ICONES_POR_TIPO[tipo] ?? MdOutlineAnnouncement;

  return <Icon size={size} color={color} aria-hidden="true" />;
}
 