'use client';
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import ReceptorSelect from "@/features/encomendas/components/ReceptorSelect/ReceptorSelect";
import Button from "@/components/ui/Button/Button";
import Styles from "./FormEntrega.module.css";
import { deliverEncomenda } from "@/features/encomendas/services/encomendasEntregaPUT.js";
import { listPessoasAutorizadas } from "@/features/pessoasAutorizadas/services/pessoasAutorizadasGET.js";
import TokenInline from "@/components/ui/Modal/TokenInline/TokenInline";

export default function FormEntrega({ encomenda, onClose, onSuccess, onVoltar }) {

    // terceiro = checkbox; quando desmarcado, o tipo vem da escolha no seletor
    const [terceiro, setTerceiro] = useState(false);
    const [receptor, setReceptor] = useState({
        tipo: "MORADOR",
        id: encomenda?.idDestinatario,
        label: encomenda?.nomeMorador,
    });
    const tiporetirada = terceiro ? "TERCEIRO" : receptor.tipo; // 'TERCEIRO' | 'MORADOR' | 'AUTORIZADA'

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [tokenDigitado, setTokenDigitado] = useState("");

  
    const [etapaNomeTerceiro, setEtapaNomeTerceiro] = useState(false);
    const [nomeTerceiro, setNomeTerceiro] = useState("");

    const [pessoasAutorizadas, setPessoasAutorizadas] = useState([]);
    const [loadingPessoas, setLoadingPessoas] = useState(false);

    useEffect(() => {
    if (!encomenda?.idMorador) return;

    setLoadingPessoas(true);
    listPessoasAutorizadas(encomenda.idMorador)
        .then((data) => setPessoasAutorizadas(data ?? []))
        .catch((err) => console.error("Erro ao buscar pessoas autorizadas:", err))
        .finally(() => setLoadingPessoas(false));
}, [encomenda?.idMorador]);

    // Grupos exibidos no seletor: dono da encomenda + pessoas autorizadas
    const gruposReceptor = [
        {
            chave: "MORADOR",
            titulo: "Morador",
            itens: encomenda
                ? [{ value: encomenda.idDestinatario, label: encomenda.nomeMorador }]
                : [],
        },
        {
            chave: "AUTORIZADA",
            titulo: "Autorizadas",
            itens: pessoasAutorizadas.map((p) => ({
                value: p.idPessoaAutorizada,
                label: p.nome,
            })),
        },
    ];

    async function handleConfirmarEntrega(e) {
        e.preventDefault();
        setErro("");

        if (tiporetirada === "TERCEIRO") {
         
            if (!etapaNomeTerceiro) {
                if (tokenDigitado.length < 4) {
                    setErro("Preencha todos os 4 dígitos do token.");
                    return;
                }

                if (tokenDigitado !== String(encomenda?.tokenEncomenda)) {
                    setErro("Token inválido. Verifique o código e tente novamente.");
                    return;
                }

                setEtapaNomeTerceiro(true);
                return;
            }

         
            if (!nomeTerceiro.trim()) {
                setErro("Informe o nome de quem retirou a encomenda.");
                return;
            }
        }

     
        const nomeRecebedor =
            tiporetirada === "TERCEIRO"
                ? nomeTerceiro.trim()
                : (receptor.label || encomenda?.nomeMorador);

        setLoading(true);

        try {
            await deliverEncomenda(
                encomenda.idEncomenda,
                tiporetirada,
                nomeRecebedor,
            );
            await onSuccess?.();
            onClose?.();

        } catch (err) {

            setErro(err.message || "Erro ao registrar entrega. Tente novamente.");
        } finally {
            setLoading(false);
        }

    }

    function handleVoltar() {
        
        if (etapaNomeTerceiro) {
            setEtapaNomeTerceiro(false);
            setErro("");
            return;
        }
        onVoltar?.();
    }

    return (

        <form onSubmit={handleConfirmarEntrega} className="p-3 gap-4">
            {/* Cabeçalho */}
            <div className="d-flex justify-content-start align-items-center mb-4 border-bottom pb-2 gap-2 w-100">
                <h1 className="h4 text-primary-custom mb-1">Registrar Entrega</h1>
                <span className="h5 text-primary-custom mb-1">ID: {encomenda?.idEncomenda}#</span>
            </div>

            {/* Checkbox Terceiro (escondido na etapa do nome) */}
            {!etapaNomeTerceiro && (
                <Form.Check
                    type="checkbox"
                    checked={terceiro}
                    label={
                    <span style={{ color: "rgba(var(--alertColor), 1)" }}>
                        Retirada feita por terceiro?
                    </span>
                    }
                    className={Styles.CheckboxInput}
                    onChange={(e) => {
                        setTerceiro(e.target.checked);
                        setErro("");
                    }}
                />
            )}

            {}
            {terceiro ? (
                etapaNomeTerceiro ? (
                    <Form.Group className="mt-3">
                        <Form.Label className="fw-semibold">Nome de quem retirou</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nome completo do terceiro"
                            value={nomeTerceiro}
                            onChange={(e) => setNomeTerceiro(e.target.value)}
                            autoFocus
                        />
                    </Form.Group>
                ) : (
                    <TokenInline
                        value={tokenDigitado}
                        onChange={setTokenDigitado}
                        onReenviar={() => {
                        
                            console.log("Reenviar para:", encomenda?.emailDestinatario);
                        }}
                    />
                )
            ) : (
                <ReceptorSelect
                    grupos={gruposReceptor}
                    value={receptor}
                    onChange={({ tipo, id, label }) => setReceptor({ tipo, id, label })}
                    isLoading={loadingPessoas}
                    textoVazio="Nenhuma pessoa autorizada cadastrada"
                />
            )}

            {erro && (
                <p className="mt-3 mb-0" style={{ color: "rgb(var(--alertColor))", fontSize: "0.875rem" }}>
                    {erro}
                </p>
            )}

            {/* Botões */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button
                   type="button" variant="primary"
                   className="w-100"
                    onClick={handleVoltar}
                    disabled={loading}
                >
                    Voltar
                </Button>
                <Button
                    type="submit" variant="secondary" className="w-100"
                    disabled={loading}
                >
                    {loading
                        ? "Validando..."
                        : terceiro && !etapaNomeTerceiro
                            ? "Validar token"
                            : "Finalizar Entrega"}
                </Button>
            </div>
        </form>

    );
}
