"use client";

import { useEffect } from "react";
import Image from "next/image";
import classNames from "classnames";
import { Navbar, Container, Nav, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

import Button from "../Button/Button";
import Filtro from "./Filtro/Filtro";
import styles from "./Header.module.css";

import useDebounce from "@/utils/debounce.js";
import { useAuth } from "@/app/auth.js";
import { pegarIniciais } from "@/utils/pegaIniciaisNome.js";
import { useEntityModal } from "@/hooks/useEntityModal";

import ProfileUser from "@/components/ui/ProfileUser/ProfileUser";
import {
  moradorFields,
  porteiroFields,
  sindicoFields,
} from "@/components/ui/ProfileUser/profileFields.js";
import { updateProfile } from "@/features/profile/services/profilePUT.js";
import { deleteProfile } from "@/features/profile/services/profileDELETE";

const ROLE_LABELS = {
  ROLE_ADMIN: "Admin",
  ROLE_PORTEIRO: "Porteiro",
  ROLE_MORADOR: "Morador",
  ROLE_SINDICO: "Síndico",
};

const PROFILE_FIELDS_BY_ROLE = {
  ROLE_PORTEIRO: porteiroFields,
  ROLE_SINDICO: sindicoFields,
  ROLE_MORADOR: moradorFields,
};

export default function Header({
  titulo,
  navItens = [],
  activeTab,
  setActiveTab,
  search,
  setSearch,
  setDebouncedSearch,
  canAdd = false,
  onAddbuttonClick,
  users = [],
  filters = {},
  onFiltersChange
}) {
  const { user, profile, refreshProfile } = useAuth();

  // só existe busca se a página passar setSearch
  const hasSearch = typeof setSearch === "function";
  // só existe filtro se a página passar onFiltersChange
  const hasFilter = typeof onFiltersChange === "function";
  const hasNav = Array.isArray(navItens) && navItens.length > 0;

  // pesquisa com debounce para reduzir o número de requisições
  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    if (hasSearch && typeof setDebouncedSearch === "function") {
      setDebouncedSearch(debounceSearch);
    }
  }, [debounceSearch, hasSearch, setDebouncedSearch]);

  const role = user?.role;
  const profileFields = PROFILE_FIELDS_BY_ROLE[role] ?? [];

  const modal = useEntityModal({
    onCreate: () => { },
    onUpdate: (_id, formData) => updateProfile(formData),
    getId: (item) => item?.idUsuario ?? item?.id,
    onRefresh: refreshProfile,
  });

  return (
    <div className={styles.componentWrapper}>
      <header className={styles.header}>
        <h1>
          <span style={{ color: "#757575" }}>Olá,</span>{" "}
          {ROLE_LABELS[role] || "Usuário"}!
        </h1>

        <button
          type="button"
          className={styles.user}
          onClick={() => modal.openEdit(profile)}
          disabled={!profile}
          aria-haspopup="dialog"
          aria-expanded={modal.open}
        >
          <h3>{user?.nome}</h3>
          {user?.fotoPerfil ? (
            <Image
              src={user.fotoPerfil}
              alt="avatar"
              width={44}
              height={44}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.perfilCircle}>
              <p>{user?.nome ? pegarIniciais(user.nome) : "WC"}</p>
            </div>
          )}
        </button>
      </header>

      {(hasNav || hasSearch || canAdd || hasFilter) && (
        <Navbar className={styles.navbar}>
          <Container fluid className={styles.navContainer}>
            <div className={styles.navGroup}>
              <h2 className={styles.titulo}>{titulo}</h2>

              {hasNav && (
                <Nav className="mt-3 gap-4 align-items-center">
                  {navItens.map((item, i) => (
                    <Nav.Link
                      key={i}
                      onClick={() => setActiveTab?.(item.texto)}
                      className={styles.navLink}
                      style={{
                        color: activeTab === item.texto ? "#003366" : "#6c757d",
                        borderBottom:
                          activeTab === item.texto ? "3px solid #003366" : "none",
                        fontWeight: activeTab === item.texto ? "600" : "400",
                      }}
                    >
                      {item.texto}
                    </Nav.Link>
                  ))}

                  {/* Filtro junto da navegação (casos 1 e 2) */}
                  {hasFilter && (
                    <Filtro
                      users={users}
                      filters={filters}
                      onFiltersChange={onFiltersChange}
                    />
                  )}
                </Nav>
              )}
            </div>

            {(hasSearch || canAdd || (hasFilter && !hasNav)) && (
              <div
                className={classNames(styles.searchGroup, {
                  [styles.searchGroupNoNav]: !hasNav,
                })}
              >
                {/* Filtro ao lado da busca (caso 3: sem navegação) */}
                {hasFilter && !hasNav && (
                  <Filtro
                    users={users}
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                  />
                )}

                {hasSearch && (
                  <InputGroup>
                    <InputGroup.Text className={styles.searchIcon}>
                      <Search />
                    </InputGroup.Text>

                    <Form.Control
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Pesquisar..."
                      className={styles.searchInput}
                    />
                  </InputGroup>
                )}

                {canAdd && (
                  <Button variant="primary" onClick={() => onAddbuttonClick?.()}>
                    Adicionar
                  </Button>
                )}
              </div>
            )}
          </Container>
        </Navbar>
      )}

      {/* Modal de perfil do usuário */}
      <ProfileUser
        show={modal.open}
        onHide={modal.close}
        title="Meu Perfil"
        fields={profileFields}
        initialData={profile}
        onSaveChanges={modal.save}
        onDeleteProfile={deleteProfile}
      />
    </div>
  );
}