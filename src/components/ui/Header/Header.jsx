"use client";

import { Navbar, Container, Nav, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import {useState, useEffect} from "react";
import Button from "../Button/Button";
import Filtro from "./Filtro/Filtro";
import styles from "./Header.module.css";
import Image from "next/image";
import useDebounce from "@/utils/debounce.js";
import { useAuth } from "@/app/auth.js";
import classNames from "classnames";

import { pegarIniciais } from "@/utils/pegaIniciaisNome.js"
import ProfileUser from "@/components/ui/ProfileUser/ProfileUser";

import { moradorFields, porteiroFields, sindicoFields } from "@/components/ui/ProfileUser/profileFields.js";

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
  onFiltersChange,
}) {
  // só existe busca se a página passar setSearch
  const hasSearch = typeof setSearch === "function";
  // só existe filtro se a página passar onFiltersChange
  const hasFilter = typeof onFiltersChange === "function";

  // pesquisa com debounce (delay) para reduzir numero de requisições
  const debounceSearch = useDebounce(search, 500);

  const hasNav = Array.isArray(navItens) && navItens.length > 0;

  const getProfileFields = (role) => {
    switch (role) {
      case "ROLE_PORTEIRO":
        return porteiroFields;
      case "ROLE_SINDICO":
        return sindicoFields;
      case "ROLE_MORADOR":
        return moradorFields;
      default:
        return [];
    }
  };

  useEffect(() => {
    if (hasSearch && typeof setDebouncedSearch === "function") {
      setDebouncedSearch(debounceSearch);
    }
  }, [debounceSearch]);

  const { user } = useAuth();
  const [showUser, setShowUser] = useState(false);

  const roleLabels = {
    ROLE_ADMIN: "Admin",
    ROLE_PORTEIRO: "Porteiro",
    ROLE_MORADOR: "Morador",
    ROLE_SINDICO: "Síndico",
  };

  const role = user?.role;

  return (
    <div className={styles.componentWrapper}>
      <header className={styles.header}>
        <h1>
          <span style={{ color: "#757575" }}>Olá,</span>{" "}
          {roleLabels[role] || "Usuário"}!
        </h1>

        <div className={styles.user} 
          onClick={() => setShowUser((prev) => !prev)}
          aria-expanded={showUser}
          aria-haspopup="dialog"
        >
          <h3>{user?.nome}</h3>
          {user?.fotoPerfil ? (
            <Image
              src={user?.fotoPerfil}
              alt="avatar"
              width={44}
              height={44}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.perfilCircle}>
              <p>{user?.nome ? pegarIniciais(user?.nome) : "WC"}</p>
            </div>
          )}
        </div>
      </header>
      {(hasNav || hasSearch || canAdd) && (
        <Navbar className={styles.navbar}>
          <Container fluid className={styles.navContainer}>

            <div className={styles.navGroup}>
              <h2 className={styles.titulo}>{titulo}</h2>
              {hasNav && (
                <Nav className="mt-3 gap-4 align-items-center">
                  {navItens.map((item, i) => (
                    <Nav.Link
                      key={i}
                      onClick={() => {
                        setActiveTab?.(item.texto);
                      }}
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


            {(hasSearch || canAdd) && (
              <div className={classNames(styles.searchGroup, {
                [styles.searchGroupNoNav]: !hasNav,
              })}>
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
                  <Button variant="primary" onClick={() => onAddbuttonClick()}>
                    Adicionar
                  </Button>
                )}
              </div>
            )}
          </Container>
        </Navbar>
      )}

      
      <ProfileUser /* Modal de perfil do usuário */
        show={showUser}
        onHide={() => setShowUser(false)}
        title="Meu Perfil"
        fields={getProfileFields(role)}
        initialData={user}
      />

    </div>
  );
}
