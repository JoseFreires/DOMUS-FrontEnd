"use client";

import { useEffect, useRef } from "react";
import { FiPackage } from "react-icons/fi";
import Title from "@/app/components/Title/Title";
import styles from "./EncomendaCarousel.module.css";
import { formatDateTime } from "@/app/hooks/formatar";

const STATUS_COLOR = {
  RECEBIDA: "#E0B954",
  ENTREGUE: "#1B5E20",
  "A RETIRAR": "#E0B954",
  RETIRADO: "#1B5E20",
};
 
const STATUS_LABEL = {
  RECEBIDA: "Recebido",
  ENTREGUE: "Retirado",
  "A RETIRAR": "A Retirar",
  RETIRADO: "Retirado",
};
 
function EncomendaSlide({ item }) {
  const statusKey = String(item?.status || "").toUpperCase();
  const statusColor = STATUS_COLOR[statusKey] ?? "#757575";
  const statusLabel = STATUS_LABEL[statusKey] ?? item?.status ?? "—";
  return (
    <div className={styles.slide}>
      {/* Ícone */}
      <div className={styles.slideIcon}>
        <FiPackage size={52} color="var(--primaryColor)" />
      </div>
 
      {/* Conteúdo */}
      <div className={styles.slideContent}>
        <p className={styles.slideTitulo}>{item?.nomePacote ?? "Encomenda"}</p>
        <p className={styles.slideDate}>
          {formatDateTime(item?.dataHoraRecebido)}
        </p>
        <p className={styles.slideApto}>Apto. {item?.numeroApartamento}</p>
 
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>STATUS:</span>
          <span
            className={styles.statusBadge}
            style={{
              backgroundColor:
                statusKey === "ENTREGUE" || statusKey === "RETIRADO"
                  ? "#1B5E20"
                  : "#E0B954",
              color:
                statusKey === "ENTREGUE" || statusKey === "RETIRADO"
                  ? "#81C784"
                  : "#6D5200",
            }}
          >
            <span
              className={styles.statusDot}
              style={{ backgroundColor: statusColor }}
            />
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
export default function EncomendaCarousel({
  data = [],
  title = "Minhas Encomendas",
  viewAllHref = "/pages/meus-pacotes",
  isLoading = false,
}) {
  const carouselRef = useRef(null);
 

  useEffect(() => {
    if (!carouselRef.current) return;
    let Carousel;
    try {
      Carousel = window.bootstrap?.Carousel;
    } catch (_) {}
    if (Carousel) {
      new Carousel(carouselRef.current, { interval: false, touch: true });
    }
  }, []);
 
  const carouselId = "encomenda-carousel";
 
  return (
    <div className={styles.wrapper}>
      <Title Text={title} />
 
      <div className={styles.card}>
        {isLoading ? (
          <p className={styles.emptyState}>Carregando...</p>
        ) : !data || data.length === 0 ? (
          <p className={styles.emptyState}>Nenhuma encomenda encontrada.</p>
        ) : (
          <>
            {/* ── Bootstrap 5 Carousel ── */}
            <div
              id={carouselId}
              ref={carouselRef}
              className="carousel slide"
              data-bs-ride="false"
            >
              {/* Indicadores (bolinhas) */}
              {data.length > 1 && (
                <div className="carousel-indicators">
                  {data.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      data-bs-target={`#${carouselId}`}
                      data-bs-slide-to={idx}
                      className={`${styles.indicator} ${idx === 0 ? "active" : ""}`}
                      aria-label={`Slide ${idx + 1}`}
                      aria-current={idx === 0 ? "true" : undefined}
                    />
                  ))}
                </div>
              )}
 
              {/* Slides */}
              <div className={`carousel-inner ${styles.carouselInner}`}>
                {data.map((item, idx) => (
                  <div
                    key={item?.id ?? idx}
                    className={`carousel-item ${idx === 0 ? "active" : ""}`}
                  >
                    <EncomendaSlide item={item} />
                  </div>
                ))}
              </div>
 
              {/* Controles anterior / próximo */}
              {data.length > 1 && (
                <>
                  <button
                    className={`carousel-control-prev ${styles.control}`}
                    type="button"
                    data-bs-target={`#${carouselId}`}
                    data-bs-slide="prev"
                    aria-label="Anterior"
                  >
                    <span
                      className={`carousel-control-prev-icon ${styles.controlIcon}`}
                      aria-hidden="true"
                    />
                  </button>
 
                  <button
                    className={`carousel-control-next ${styles.control}`}
                    type="button"
                    data-bs-target={`#${carouselId}`}
                    data-bs-slide="next"
                    aria-label="Próximo"
                  >
                    <span
                      className={`carousel-control-next-icon ${styles.controlIcon}`}
                      aria-hidden="true"
                    />
                  </button>
                </>
              )}
            </div>
            {/* ── fim Carousel ── */}
 
            {/* Rodapé "Ver todos" */}
            {viewAllHref && (
              <div className={styles.footer}>
                <a href={viewAllHref} className={styles.viewAllLink}>
                  Ver todos →
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}