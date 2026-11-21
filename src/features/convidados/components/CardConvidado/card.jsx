import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import { FaCircleUser } from "react-icons/fa6";

// Mesmo critério usado pela página para separar as abas
export const isConvidadoInativo = (c) =>
    c?.ativo === false || c?.ativo === 0 || String(c?.status ?? "").toLowerCase() === "inativo";

export const apenasDigitos = (valor) => String(valor ?? "").replace(/\D/g, "");

export function mascaraCpf(valor) {
    const d = apenasDigitos(valor).slice(0, 11);
    return d
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export default function CardConvidado({
    convidadoData = {},
    onButtonOpenModal,
    onToggleStatus,
    changingStatus = false,
    onRegistrar,
    registrando = false,

}) {
    const inativo = isConvidadoInativo(convidadoData);
    const clicavel = typeof onButtonOpenModal === "function";
    const podeRegistrar = typeof onRegistrar === "function" && !inativo;
    const ocupado = changingStatus || registrando;

    const abrir = () => onButtonOpenModal?.(convidadoData);

    const handleKeyDown = (e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrir();
        }
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        onToggleStatus?.(convidadoData);
    };

    const handleRegistrar = (e) => {
        e.stopPropagation(); // não abre o modal de edição
        onRegistrar?.(convidadoData);
    };

    return (
        <Card
            className="h-100 shadow-sm"
            onClick={clicavel ? abrir : undefined}
            onKeyDown={clicavel ? handleKeyDown : undefined}
            role={clicavel ? "button" : undefined}
            tabIndex={clicavel ? 0 : undefined}
            style={{ cursor: clicavel ? "pointer" : "default", opacity: inativo ? 0.85 : 1 }}
        >
            <Row className="g-0 align-items-center p-3 flex-grow-1">
                <Col xs={5} md={6} className="d-flex justify-content-center align-items-center">
                    <FaCircleUser
                        size={100}
                        color={inativo ? "#9aa0a6" : "#003366"}
                        aria-hidden="true"
                    />
                </Col>

                <Col xs={7} md={6}>
                    <Card.Body className="text-center">
                        <Card.Title className="fw-bold" style={{ color: "#003366", fontSize: 18 }}>
                            {convidadoData.nome}
                        </Card.Title>

                        {convidadoData.frequencia && (
                            <div className="fw-semibold">{convidadoData.frequencia}</div>
                        )}
                        {convidadoData.tipo && (
                            <div className="fw-semibold">{convidadoData.tipo}</div>
                        )}

                        <div className="fw-semibold">{mascaraCpf(convidadoData.cpf)}</div>

                        <div className="fw-semibold">
                            <Badge bg={inativo ? "secondary" : "success"}>
                                {inativo ? "Inativo" : "Ativo"}
                            </Badge>
                        </div>
                    </Card.Body>
                </Col>
            </Row>

            {(podeRegistrar || onToggleStatus) && (
                <Card.Footer className="bg-transparent border-0 pt-0 pb-3 px-3 d-flex flex-column gap-2">
                    {podeRegistrar && (
                        <button
                            type="button"
                            className="btn btn-success w-100"
                            onClick={handleRegistrar}
                            disabled={ocupado}
                            aria-label={`Registrar chegada do convidado ${convidadoData.nome ?? ""}`}
                        >
                            {registrando ? "Registrando..." : "Registrar chegada"}
                        </button>
                    )}

                    {onToggleStatus && (
                        <button
                            type="button"
                            className={`btn w-100 ${inativo ? "btn-primary" : "btn-outline-danger"}`}
                            onClick={handleToggle}
                            disabled={ocupado}
                            aria-label={`${inativo ? "Ativar" : "Inativar"} convidado ${convidadoData.nome ?? ""}`}
                        >
                            {changingStatus
                                ? inativo ? "Ativando..." : "Inativando..."
                                : inativo ? "Ativar" : "Inativar"}
                        </button>
                    )}
                </Card.Footer>
            )}
        </Card>
    );
}