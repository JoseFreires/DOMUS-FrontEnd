"use client";

import { useRef, useState } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/auth.js";
import { useRouter } from "next/navigation";
import { BsBoxSeam, BsBuilding } from "react-icons/bs";
import { checkAccess } from "@/utils/controlAccess";
import { FaRegCalendarAlt } from "react-icons/fa";

const HOME_BY_ROLE = {
    ROLE_SINDICO:  "/pages/home/sindico",
    ROLE_PORTEIRO: "/pages/home/porteiro",
    ROLE_MORADOR:  "/pages/home/morador",
    ROLE_ADMIN:    "/pages/home/sindico",
};

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const touchStartX = useRef(null);
    const touchCurrentX = useRef(null);
    const { user, signOut } = useAuth();
    const router = useRouter();
    const { adminOnly, sindicoView, porteiroView, moradorView } = checkAccess(user?.role || []);

    const homeHref = HOME_BY_ROLE[user?.role] ?? "/pages/home/porteiro";

    const closeSidebar = () => setIsOpen(false);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/pages/login");
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    const handleTouchStart = (event) => {
        touchStartX.current = event.touches[0].clientX;
        touchCurrentX.current = touchStartX.current;
    };

    const handleTouchMove = (event) => {
        if (touchStartX.current !== null) {
            touchCurrentX.current = event.touches[0].clientX;
        }
    };

    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchCurrentX.current - touchStartX.current > 70) {
            closeSidebar();
        }
        touchStartX.current = null;
        touchCurrentX.current = null;
    };

    return (
        <>
            <button
                className={styles.menuToggle}
                onClick={() => setIsOpen(true)}
                type="button"
                aria-label="Abrir menu"
                aria-expanded={isOpen}
            >
                ☰
            </button>

            <div
                className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <Link href={homeHref} className={styles.logoLink} onClick={closeSidebar}>
                    <div className={styles.logo}>
                        <Image src="/img/logoDOMUS.png" alt="Logo" width={80} height={80} />
                        <h1>DOMUS</h1>
                    </div>
                </Link>

                {moradorView && (
                    <Link href="/pages/meus-pacotes" className={styles.link} onClick={closeSidebar}>
                        <div className={styles.item}>
                            <BsBoxSeam size={25} />
                            <span>Meus Pacotes</span>
                        </div>
                    </Link>
                )}

                {moradorView && (
                    <Link href="/pages/reservarEspacosCondominiais" className={styles.link} onClick={closeSidebar}>
                        <div className={styles.item}>
                            <BsBuilding size={25} />
                            <span>Reservar Espaço</span>
                        </div>
                    </Link>
                )}

                {porteiroView && (
                    <Link href="/pages/encomendas" className={styles.link} onClick={closeSidebar}>
                        <div className={styles.item}>
                            <Image src="/img/box.svg" alt="Sidebar Icon" width={24} height={24} />
                            <span>Encomendas</span>
                        </div>
                    </Link>
                )}

                {porteiroView && (
                    <Link href="/pages/moradores" className={styles.link} onClick={closeSidebar}>
                        <div className={styles.item}>
                            <Image src="/img/moradores.svg" alt="Sidebar Icon" width={24} height={24} />
                            <span>Moradores</span>
                        </div>
                    </Link>
                )}

                {sindicoView && (
                    <Link href="/pages/funcionarios" className={styles.link} onClick={closeSidebar}>
                        <div className={styles.item}>
                            <Image src="/img/func.svg" alt="Sidebar Icon" width={24} height={24} />
                            <span>Funcionários</span>
                        </div>
                    </Link>
                )}

                {sindicoView && (
                    <Link href="/pages/gerenciarReservas" className={styles.link} onClick={closeSidebar}>
                        <div className={styles.item}>
                            <FaRegCalendarAlt size={25} />
                            <span>Gerenciar Reservas</span>
                        </div>
                    </Link>
                )}

                {adminOnly && (
                    <Link href="/pages/logs" className={styles.link} onClick={closeSidebar}>
                        <div className={styles.item}>
                            <Image src="/img/log.svg" alt="Sidebar Icon" width={24} height={24} />
                            <span>Logs</span>
                        </div>
                    </Link>
                )}

                <div className={styles.exitbutton}>
                    <button onClick={handleLogout} className={styles.link}>
                        <Image src="/img/exitIcon.png" alt="Sair" width={24} height={24} />
                    </button>
                </div>
            </div>

            {isOpen && <div className={styles.backdrop} onClick={closeSidebar} />}
        </>
    );
}