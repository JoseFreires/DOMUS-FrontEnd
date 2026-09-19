"use client";

import {styles} from "./Title.module.css";

export default function Title({ Text }) {
    return (
        <div className={`h4 text-primary-custom mb-1 ${styles.titleContainer}`}>
            <h1 className={styles.titletext}>{Text}</h1>
            <hr className={styles.titleLine} />
        </div>
    );
}
