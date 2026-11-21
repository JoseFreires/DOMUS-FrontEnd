"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, Form, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

import styles from "./ModalConvidadosMorador.module.css";
import Button from "@/components/ui/Button/Button";
import CardConvidado, { isConvidadoInativo } from "@/features/convidados/components/CardConvidado/card";
import { useConvidadosDoMorador } from "@/features/convidados/hooks/useConvidadosDoMorador";

const FILTROS = {
  todos: () => true,
  ativos: (c) => !isConvidadoInativo(c),
  inativos: (c) => isConvidadoInativo(c),
};

export default function ModalConvidadosMorador({
  show,
  onHide,
  idMorador,
  nomeMorador,
  onSelectConvidado,
  onRegistrarChegada,
}) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [idRegistrando, setIdRegistrando] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { convidados, isLoading, error, recarregar } = useConvidadosDoMorador(idMorador, show);


  useEffect(() => {
    if (show) { setIdRegistrando(null); setFeedback(null); }
  }, [show, idMorador]);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return convidados
      .filter(FILTROS[filtro])
      .filter((c) => !termo || String(c.nome ?? "").toLowerCase().includes(termo));
  }, [convidados, filtro, busca]);

  const total = convidados.length;
  const totalAtivos = convidados.filter(FILTROS.ativos).length;

  const handleRegistrar = async (convidado) => {
    if (idRegistrando !== null) return;
    setIdRegistrando(convidado.idConvidado);
    setFeedback(null);
    try {
      await onRegistrarChegada(convidado);
      setFeedback({ tipo: "sucesso", texto: `Chegada de ${convidado.nome} registrada.` });
    } catch (err) {
      console.error(err);
      setFeedback({
        tipo: "erro",
        texto: err?.name === "ApiError" ? err.message : "Não foi possível registrar a chegada. Tente novamente.",
      });
    } finally {
      setIdRegistrando(null);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      scrollable
      size="lg"
      dialogClassName={styles.dialog}
      aria-labelledby="modal-convidados-titulo"
    >
      <Modal.Header closeButton className={styles.header}>
        <div>
          <Modal.Title id="modal-convidados-titulo" className={styles.title}>
            Convidados{nomeMorador ? ` de ${nomeMorador}` : ""}
          </Modal.Title>
          {!isLoading && !error && (
            <small className={styles.resumo}>
              {total} cadastrado(s) · {totalAtivos} ativo(s)
            </small>
          )}
        </div>
      </Modal.Header>

      <Modal.Body className={styles.body}>
        <div className={styles.toolbar}>
          <InputGroup className={styles.busca}>
            <InputGroup.Text><Search aria-hidden="true" /></InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Buscar convidado..."
              aria-label="Buscar convidado pelo nome"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              disabled={isLoading || !!error}
            />
          </InputGroup>

          <Form.Select
            className={styles.filtro}
            aria-label="Filtrar por situação"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            disabled={isLoading || !!error}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </Form.Select>
        </div>

        {feedback && (
          <p
            className={feedback.tipo === "sucesso" ? "text-success" : "text-danger"}
            role={feedback.tipo === "erro" ? "alert" : "status"}
          >
            {feedback.texto}
          </p>
        )}

        {isLoading ? (
          <p className={styles.estado}>Carregando convidados...</p>
        ) : error ? (
          <div className={styles.estado} role="alert">
            <p>{error.message || "Não foi possível carregar os convidados."}</p>
            <Button variant="primary" onClick={recarregar}>Tentar novamente</Button>
          </div>
        ) : visiveis.length === 0 ? (
          <p className={styles.estado}>
            {total === 0
              ? "Este morador ainda não tem convidados cadastrados."
              : "Nenhum convidado corresponde à busca."}
          </p>
        ) : (
          <div className={styles.grid}>
            {visiveis.map((convidado, index) => (
              <CardConvidado
                key={convidado.idConvidado ?? index}
                convidadoData={convidado}
                onButtonOpenModal={onSelectConvidado}
                onRegistrar={onRegistrarChegada ? handleRegistrar : undefined}
                registrando={idRegistrando === convidado.idConvidado}
              />
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className={styles.footer}>
        <Button variant="primary" onClick={onHide}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
}