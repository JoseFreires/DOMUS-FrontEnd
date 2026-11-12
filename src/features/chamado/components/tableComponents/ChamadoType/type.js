import {
  FiAlertTriangle,
  FiHelpCircle,
  FiMessageCircle,
} from "react-icons/fi";
import styles from "@/app/pages/encomendas/page.module.css";
import { TfiLightBulb } from "react-icons/tfi";

export function ChamadoType({ value }) {
  const normalizedValue = value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  const types = {
    SUGESTAO: { label: "SUGESTÃO", Icon: TfiLightBulb},
    RECLAMACAO: { label: "RECLAMAÇÃO", Icon: FiMessageCircle },
    INCIDENTE: { label: "INCIDENTE", Icon: FiAlertTriangle },
    DUVIDA: { label: "DUVIDA", Icon: FiHelpCircle },
  };
  const { label, Icon } = types[normalizedValue] ?? {
    label: value || "—",
    Icon: FiHelpCircle,
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: "#003366",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        <Icon size={14} />
      </span>
      <span className={styles.tableLine}>{label}</span>
    </span>
  );
}
