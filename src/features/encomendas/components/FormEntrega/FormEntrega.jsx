'use client';
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Input from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Button from "@/components/ui/Button/Button";
import Styles from "./FormEntrega.module.css";
import {deliverEncomenda} from "@/features/encomendas/services/encomendasEntregaPUT.js";
import { listPessoasAutorizadas } from "@/features/pessoasAutorizadas/services/pessoasAutorizadasGET.js";
import TokenInline from "@/components/ui/Modal/TokenInline/TokenInline";

export default function FormEntrega({ encomenda, onClose, onSuccess, onVoltar }) {

    const [tiporetirada, setTiporetirada] = useState("MORADOR");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [tokenDigitado, setTokenDigitado] = useState("");

    const [pessoasAutorizadas, setPessoasAutorizadas] = useState([]);
    const [loadingPessoas, setLoadingPessoas] = useState(false);
 
    useEffect(() => {
        if (!encomenda?.idDestinatario) return;
 
        setLoadingPessoas(true);
        listPessoasAutorizadas(encomenda.idDestinatario)
            .then((data) => {
                setPessoasAutorizadas(data ?? []);
            })
            .finally(() => setLoadingPessoas(false));
    }, [encomenda?.idDestinatario]);
 

    const opcoesReceptor = encomenda
        ? [
              {
                  idPessoa: encomenda.idDestinatario,
                  nomeMorador: encomenda.nomeMorador,
              },
              ...pessoasAutorizadas.map((p) => ({
                  idPessoa: p.idPessoaAutorizada,
                  nomeMorador: p.nome,
              })),
          ]
        : [];

        async function handleConfirmarEntrega(e) {
        e.preventDefault();
        setErro("");

        if (tiporetirada === "TERCEIRO") {
            if (tokenDigitado.length < 4) {
                setErro("Preencha todos os 4 dígitos do token.");
                return;
            }
 

            if (tokenDigitado !== String(encomenda?.tokenEncomenda)) {
                setErro("Token inválido. Verifique o código e tente novamente.");
                return;
            }
        }

        setLoading(true);

            try {
            await deliverEncomenda(
                encomenda.idEncomenda,
                tiporetirada,
            );
            await onSuccess?.(); 
            onClose?.();

            } catch (err) {
                
                setErro(err.message || "Erro ao registrar entrega. Tente novamente.");
            } finally {
                setLoading(false);
            }
        
    }   
    return (

        <form onSubmit={handleConfirmarEntrega} className="p-3 gap-4">
            {/* Cabeçalho */}
            <div className="d-flex justify-content-start align-items-center mb-4 border-bottom pb-2 gap-2 w-100">
                <h1 className="h4 text-primary-custom mb-1">Registrar Entrega</h1>
                <span className="h5 text-primary-custom mb-1">ID: {encomenda?.idEncomenda}#</span>
            </div>

            {/* Checkbox Terceiro */}
            <Form.Check
                type="checkbox"
                label={
                <span style={{ color: "rgba(var(--alertColor), 1)" }}>
                    Retirada feita por terceiro?
                </span>
                }
                className={Styles.CheckboxInput}
                onChange={(e)=> {
                        setTiporetirada(e.target.checked ? "TERCEIRO" : "MORADOR");
                        setErro("");
                    }}
            />

            {/* Renderização Condicional: Terceiro vs Morador */}
            {tiporetirada === "TERCEIRO" ? (
                    <TokenInline
                        value={tokenDigitado}
                        onChange={setTokenDigitado}
                        onReenviar={() => {
                            // TODO: endpoint de reenvio de token
                            console.log("Reenviar para:", encomenda?.emailDestinatario);
                        }}
                    />
            ) : (
                <Dropdown
                    options={opcoesReceptor}
                    placeholder="Selecione o receptor"
                    value={encomenda?.idDestinatario}
                    defaultValue={encomenda?.idDestinatario}
                    onChange={()=>setTiporetirada("MORADOR")}
                />
               
            )}
            {/* Botões */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button 
                   type="button" variant="primary" 
                   className="w-100"
                    onClick={onVoltar}
                    disabled={loading}
                >
                    Voltar
                </Button>
                <Button 
                    type="submit" variant="secondary" className="w-100"
                    disabled={loading}
                >
                    {loading ? "Validando..." : "Finalizar Entrega"}
                </Button>
            </div>
        </form>

    );
}