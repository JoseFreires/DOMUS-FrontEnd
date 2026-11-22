"use client";

import { useEffect, useState } from "react";
import { Offcanvas, Form, Image } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import { CiImageOff } from "react-icons/ci";
import { FaUser } from "react-icons/fa";

import base from "../FormCad/CadastroModal.module.css"; 
import extra from "./SolicitacaoReservaModal.module.css";
import Button from "@/components/ui/Button/Button";
import { useDetalheSolicitacao } from "@/features/reservas/hooks/useDetalheSolicitacao";
import { STATUS_RESERVA, formatarDataISO, formatarDataHora } from "@/features/reservas/components/minhasReservasColumns";

const STATUS_PENDENTES = ["RESERVADA", "PENDENTE"];

const formatBRL = (v) =>
  v == null || v === "" || Number.isNaN(Number(v))
    ? ""
    : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));


const mascararCpf = (cpf) => {
  const d = String(cpf ?? "").replace(/\D/g, "");
  return d.length === 11 ? `${d.slice(0, 3)}.***.***-${d.slice(9)}` : "";
};

const formatarTelefone = (t) => {
  const d = String(t ?? "").replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return t ?? "";
};

function Campo({ id, label, value, as }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={id} className={base.label}>{label}</Form.Label>
      <Form.Control
        id={id}
        as={as}
        rows={as === "textarea" ? 4 : undefined}
        className={base.input}
        style={as === "textarea" ? { height: "auto" } : undefined}
        value={value ?? ""}
        readOnly
        disabled
      />
    </Form.Group>
  );
}

export default function SolicitacaoReservaModal({ show, onHide, reserva, onAprovar, onNegar }) {
  const { morador, espaco, isLoading, error, recarregar } = useDetalheSolicitacao(reserva, show);

  const [acao, setAcao] = useState(null);        
  const [negando, setNegando] = useState(false);    
  const [justificativa, setJustificativa] = useState("");
  const [erroAcao, setErroAcao] = useState("");

  useEffect(() => {
    if (show) {
      setAcao(null);
      setNegando(false);
      setJustificativa("");
      setErroAcao("");
    }
  }, [show, reserva?.idReserva]);

  const status = STATUS_RESERVA[reserva?.statusReserva] ?? {
    bg: "secondary",
    label: reserva?.statusReserva ?? "—",
  };
  const podeDecidir = STATUS_PENDENTES.includes(reserva?.statusReserva);
  const ocupado = acao !== null;
  const fotoMorador = morador?.fotoPerfil ?? morador?.foto ?? null;

  const executar = async (tipo, fn) => {
    if (ocupado || !fn) return;
    setAcao(tipo);
    setErroAcao("");
    try {
      await fn();
      onHide?.();
    } catch (err) {
      console.error(err);
      setErroAcao(
        err?.name === "ApiError" ? err.message : "Ocorreu um erro inesperado. Tente novamente."
      );
    } finally {
      setAcao(null);
    }
  };

  const handleAprovar = () => executar("aprovar", () => onAprovar?.(reserva));

  const handleConfirmarNegativa = () => {
    if (!justificativa.trim()) {
      setErroAcao("Informe o motivo da reprovação.");
      return;
    }
    executar("negar", () => onNegar?.(reserva, justificativa.trim()));
  };


  return (
    <Offcanvas
      show={show}
      onHide={ocupado ? undefined : onHide}
      placement="end"
      scroll={false}
      backdrop={false}
      className={base.offcanvas}
    >
      <Offcanvas.Header closeButton className={base.header}>
        <div style={{ width: "100%" }}>
          <Offcanvas.Title className={base.title}>
            Solicitação de reserva - {formatarDataISO(reserva?.dataReserva)}
          </Offcanvas.Title>
          <div className={base.titleUnderline} />
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className={base.body}>
        <div className={extra.resumo}>
          <Badge bg={status.bg}>{status.label}</Badge>
          <span>{reserva?.quantidadeConvidados ?? 0} convidado(s)</span>
          {reserva?.criadaEm && <span>Solicitada em {formatarDataHora(reserva.criadaEm)}</span>}
        </div>

        {reserva?.justificativaReservaNegada && (
          <p className="text-danger" role="note">
            <strong>Motivo da negativa:</strong> {reserva.justificativaReservaNegada}
          </p>
        )}

        {error && (
          <p className="text-danger" role="alert">
            {error.message || "Não foi possível carregar todos os dados."}{" "}
            <button type="button" onClick={recarregar}>Tentar novamente</button>
          </p>
        )}

        <div className={base.content}>
          {/* ── Esquerda: morador ── */}
          <div className={base.form}>
            <h3 className={extra.secao}>Morador</h3>

            {isLoading && !morador ? (
              <p>Carregando morador...</p>
            ) : (
              <>
                <div className={extra.fotoMorador}>
                  {fotoMorador ? (
                    <Image
                      src={fotoMorador}
                      alt={`Foto de ${morador?.nomeCompleto ?? "morador"}`}
                      roundedCircle
                      className={base.photoPreview}
                    />
                  ) : (
                    <FaUser size={90} aria-label="Morador sem foto" role="img" />
                  )}
                </div>

                <Campo id="sol-nome" label="Nome completo" value={morador?.nomeCompleto} />
                <Campo id="sol-email" label="E-mail" value={morador?.email} />
                {/* <div className={extra.duasColunas}>
                  <Campo id="sol-bloco" label="Bloco" value={morador?.bloco} />
                  <Campo id="sol-apto" label="Apartamento" value={morador?.numeroApartamento} />
                </div> */}
                <div className={extra.duasColunas}>
                  <Campo id="sol-tel" label="Telefone" value={formatarTelefone(morador?.telefone)} />
                  <Campo id="sol-cpf" label="CPF" value={mascararCpf(morador?.cpf)} />
                </div>
              </>
            )}
          </div>

          <div className={base.dividerVertical} />

          {/* ── Direita: espaço ── */}
          <div className={extra.colunaEspaco}>
            <h3 className={extra.secao}>Espaço condominial</h3>
            {isLoading && !espaco ? (
              <p>Carregando espaço...</p>
            ) : (
              <>
                <div className={extra.fotoEspaco}>
                  {espaco?.fotoEspaco ? (
                    <Image src={espaco.fotoEspaco} alt={`Foto de ${espaco.nomeEspaco}`} className={base.photoPreview} />
                  ) : (
                    <CiImageOff size={64} aria-hidden="true" />
                  )}
                </div>
                <Campo id="esp-nome" label="Nome do espaço" value={espaco?.nomeEspaco ?? reserva?.nomeEspaco} />
                <div className={extra.duasColunas}>
                  <Campo id="esp-cap" label="Capacidade máx." value={espaco?.capacidadeMaxima} />
                  <Campo id="esp-valor" label="Valor da reserva" value={formatBRL(espaco?.valorReserva)} />
                </div>
                <Campo id="esp-desc" label="Descrição" value={espaco?.descricao} as="textarea" />
                <Campo id="esp-restr" label="Restrição" value={espaco?.restricao || "Nenhuma"} />
              </>
            )}
          </div>
        </div>

        {/* ── Ações ── */}
        {podeDecidir && (
          <div className={extra.rodape}>
            {negando && (
              <Form.Group className={extra.justificativa}>
                <Form.Label htmlFor="sol-justificativa" className={base.label}>
                  Motivo da reprovação
                </Form.Label>
                <Form.Control
                  id="sol-justificativa"
                  as="textarea"
                  rows={3}
                  maxLength={500}
                  placeholder="Explique ao morador por que a reserva foi reprovada"
                  value={justificativa}
                  onChange={(e) => { setJustificativa(e.target.value); setErroAcao(""); }}
                  disabled={ocupado}
                  autoFocus
                />
              </Form.Group>
            )}

            {erroAcao && <p className="text-danger small mb-2" role="alert">{erroAcao}</p>}

            <div className={extra.acoes}>
              {negando ? (
                <>
                  <Button variant="primary" onClick={() => { setNegando(false); setErroAcao(""); }} disabled={ocupado}>
                    Voltar
                  </Button>
                  <Button variant="critical" onClick={handleConfirmarNegativa} disabled={ocupado}>
                    {acao === "negar" ? "Reprovando..." : "Confirmar reprovação"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="critical" onClick={() => setNegando(true)} disabled={ocupado}>
                    Reprovar
                  </Button>
                  <Button variant="primary" onClick={handleAprovar} disabled={ocupado}>
                    {acao === "aprovar" ? "Aprovando..." : "Aprovar"}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
