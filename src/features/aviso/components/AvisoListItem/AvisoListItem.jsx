"use client";

import styles from "@/components/ui/ListItems.module.css";

export default function AvisoListItem({ icon, titulo, nomeSindico , data}) {

    return (
        <div className={styles.avisoRow}>
            <div className={styles.iconCircle}>
                {icon}
            </div>
            <div className={styles.avisoContent}>
                <h3 className={styles.avisoTitulo}>{titulo}</h3>
                <p className={styles.linkText}>{nomeSindico}</p>
                <p className={styles.mutedText}>{data}</p>
            </div>
        </div>
    );
}   