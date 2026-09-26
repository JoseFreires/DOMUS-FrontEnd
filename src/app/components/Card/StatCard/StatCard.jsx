"use client";

import styles from "./StatCard.module.css";

export default function StatCard({
  icon,
  title,
  value,
  percentage = 0,
  comparisonLabel,

}) {
  const isPositive = percentage >= 0;
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div
          className={styles.iconCircle}
        >
          {icon}
        </div>
        <p className={`h4 bold${styles.title}`}>{title}</p>
      </div>
      <div className={styles.body}>
        <p className={styles.value}>{value}</p>

        <div className={styles.comparisonRow}>
          <span className={styles.badge}>
            <ArrowIcon up={isPositive} />
            {Math.abs(percentage)}%
          </span>
          {comparisonLabel && (
            <span className={styles.comparisonLabel}>{comparisonLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ up }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d={
          up
            ? "M12 19V5M12 5L5 12M12 5L19 12"
            : "M12 5V19M12 19L5 12M12 19L19 12"
        }
        stroke="#f1f1f1"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
