"use client";

import Image from "next/image";
import Form from "react-bootstrap/Form";
import Input from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Button from "@/components/ui/Button/Button";
import Styles from "./Form.module.css";
import { useState, useEffect, useMemo } from "react";
import { listMorador, getPessoaId, getMoradiaIds } from "@/features/morador/services/moradorGET.js";
import { useMoradorOptions } from "@/features/morador/hooks/useMoradorOptions";
import { useBlocoOptions } from "@/features/bloco/hooks/useBlocoOptions";
import { useMoradiaOptions } from "@/features/moradia/hooks/useMoradiaOptions";


export default function FormEncomenda({
  title,
  modo,
  encomendaData,
  onSaveChanges,
  onDeliver,
}) {
  const [moradores, setMoradores] = useState([]);
  const [nomePacote, setNomePacote] = useState(encomendaData?.nomePacote || "");
  const [observacao, setObservacao] = useState(encomendaData?.observacao || "");
  const [idencomenda, setIdencomenda] = useState(
    encomendaData?.idEncomenda || "",
  );
  const [foto, setFoto] = useState(encomendaData?.fotoPacote || null);
  const [moradorSelectId, setMoradorSelectId] = useState("");
  const [idDestinatario, setIdDestinatario] = useState("");
  const [idBloco, setIdBloco] = useState("");
  const [idMoradia, setIdMoradia] = useState("");
  const [emailDestinatario, setEmailDestinatario] = useState(
    encomendaData?.emailDestinatario || "",
  );
  const [photoPreview, setPhotoPreview] = useState(encomendaData?.fotoPacote ||"/img/box.svg"); // preview padrão
  const { options: moradorOptions, isLoading } = useMoradorOptions();
  const { options: todosBlocos, isoptionLoading: isBlocoLoading } = useBlocoOptions();
  const { options: todasMoradias, isoptionLoading: isMoradiaLoading } = useMoradiaOptions();
  
  // Moradias cadastradas para o morador selecionado (mesmo formato das outras páginas:
  // { value: idMoradia, label: numero, idBloco })
  const moradiasDoMorador = useMemo(() => {
    const morador = moradores.find(
      (m) => String(getPessoaId(m)) === String(moradorSelectId),
    );
    if (!morador) return [];

    const ids = getMoradiaIds(morador);
    if (ids.length > 0) {
      return todasMoradias.filter((md) => ids.includes(String(md.value)));
    }

    // Fallback: a API do morador não trouxe o id da moradia, casa pelo número/bloco
    if (morador.numeroApartamento) {
      return todasMoradias.filter((md) => {
        const nomeBloco = todosBlocos.find(
          (b) => String(b.value) === String(md.idBloco),
        )?.label;
        return (
          String(md.label) === String(morador.numeroApartamento) &&
          (!morador.bloco || String(nomeBloco) === String(morador.bloco))
        );
      });
    }
    return [];
  }, [moradores, moradorSelectId, todasMoradias, todosBlocos]);

 // Bloco: só os blocos das moradias do morador
  const blocoOptions = useMemo(
    () =>
      todosBlocos.filter((b) =>
        moradiasDoMorador.some((md) => String(md.idBloco) === String(b.value)),
      ),
    [todosBlocos, moradiasDoMorador],
  );

  // Moradia: filhas do bloco escolhido (dependsOn idBloco / filterField idBloco)
  const moradiaOptions = useMemo(
    () =>
      moradiasDoMorador.filter(
        (md) => idBloco && String(md.idBloco) === String(idBloco),
      ),
    [moradiasDoMorador, idBloco],
  );
  const numeroApartamento =
    moradiasDoMorador.find((md) => String(md.value) === String(idMoradia))
      ?.label ?? "";

  // Pré-seleciona: moradia da encomenda (edição) ou a única opção disponível
  useEffect(() => {
    if (idMoradia || moradiasDoMorador.length === 0) return;

    let alvo = null;
    if (modo === "edit" && encomendaData?.numeroApartamento) {
      alvo = moradiasDoMorador.find(
        (md) => String(md.label) === String(encomendaData.numeroApartamento),
      );
    }
    if (!alvo && moradiasDoMorador.length === 1) alvo = moradiasDoMorador[0];

    if (alvo) {
      setIdBloco(String(alvo.idBloco));
      setIdMoradia(String(alvo.value));
    }
  }, [moradiasDoMorador, idMoradia, modo, encomendaData]);

  // Se o morador só tem um bloco, já seleciona
  useEffect(() => {
    if (!idBloco && blocoOptions.length === 1) {
      setIdBloco(String(blocoOptions[0].value));
    }
  }, [blocoOptions, idBloco]);

  useEffect(() => {
    listMorador().then((data) => {
      if (Array.isArray(data)) {
        setMoradores(data);
      } else {
        setMoradores([]);
      }
    });
  }, []);

  useEffect(() => {
    if (modo !== "edit" || !encomendaData) return;

    setNomePacote(encomendaData.nomePacote || "");
    setObservacao(encomendaData.observacao || "");
    setIdencomenda(encomendaData.idEncomenda || "");
    
    const found = moradores.find(
      (m) =>
        String(getPessoaId(m)) === String(encomendaData.idDestinatario) ||
        String(getPessoaId(m)) === String(encomendaData.idPessoa) ||
        m.nome === encomendaData.nomeMorador ||
        m.nomeMorador === encomendaData.nomeMorador,
    );

    if (found) {
      const pessoaId = getPessoaId(found);

      setMoradorSelectId(pessoaId ? String(pessoaId) : "");
      setIdDestinatario(pessoaId ? String(pessoaId) : "");
      setEmailDestinatario(
        found.email || encomendaData.emailDestinatario || "",
      );
    } else {
      setMoradorSelectId("");
      setIdDestinatario("");
      setEmailDestinatario(encomendaData.emailDestinatario || "");
    }
  }, [encomendaData, moradores, modo]);

  const handleMoradorChange = (e) => {
    const selectedPessoaId = e.target.value;

    setMoradorSelectId(selectedPessoaId);
    setIdDestinatario(selectedPessoaId);

    const morador = moradores.find(
      (m) => String(getPessoaId(m)) === String(selectedPessoaId),
    );

    // Trocou o morador: limpa bloco/moradia (os efeitos acima pré-selecionam se houver uma só opção)
    setIdBloco("");
    setIdMoradia("");

    setEmailDestinatario(morador?.email || "");
  };

  const handleBlocoChange = (e) => {
    setIdBloco(e.target.value);
    setIdMoradia(""); // filho depende do bloco
  };

  const handleMoradiaChange = (e) => {
    setIdMoradia(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSaveChanges) return;

    const dados = {
      idEncomenda: idencomenda,
      foto,
      nomePacote,
      observacao,
      idDestinatario,
      idBloco,
      idMoradia,
      numeroApartamento,
      emailDestinatario,
    };
    await onSaveChanges(dados);
  };

  let maxHeigthScrollingArea = "";
  let showButton = true;

  if (modo === "add") {
    maxHeigthScrollingArea = "60vh";
    title = "Adicionar Encomenda";
    showButton = true;
  } else if (modo === "edit") {
    encomendaData?.status == "ENTREGUE"
      ? ((maxHeigthScrollingArea = "70vh"),
        (title = "Visualizar Encomenda"),
        (showButton = false))
      : ((maxHeigthScrollingArea = "60vh"),
        (title = "Alterar Encomenda"),
        (showButton = true));
  }

  const handlePhotoChange = (e) => {
      const file = e.target.files?.[0];
  if (!file) return;
  if (photoPreview && photoPreview.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreview);
  }
  setPhotoPreview(URL.createObjectURL(file));
  setFoto(file);
  };
  return (
    <div
      className="d-flex flex-column"
      style={{ maxHeight: "95vh", minHeight: "90vh" }}
    >
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div>
          <div className="d-flex flex-row flex-md-row align-items-center gap-2">
            <h1 className="h4 text-primary-custom mb-1">{title}</h1>
            {modo === "edit" && (
              <p
                className="h5 text-primary-custom mb-1"
                style={{ color: "#003366" }}
              >
                (ID: #{encomendaData.idEncomenda})
              </p>
            )}
          </div>
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <div className="px-4 py-3 flex-grow-1 overflow-auto max-height-835">
          <div
            className="d-flex flex-column gap-4"
            style={{
              maxHeight: maxHeigthScrollingArea,
              overflowY: "auto",
              scrollbarColor: " #8a8a8a transparent",
              scrollbarwidth: "thin",
            }}
          >
            <Form.Group>
              <p>Foto da encomenda</p>

              <label htmlFor="encomenda-foto" className={Styles.photo}>
                <Image
                  className={Styles.image}
                  src={photoPreview || "/img/box.svg"} 
                  alt="Encomenda"
                  width={50}
                  height={50}
                />
              </label>
              <input
                className={Styles.photoInput}
                id="encomenda-foto"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={
                  modo === "edit" && encomendaData?.status == "ENTREGUE"
                    ? true
                    : false
                }
                hidden
              />
            </Form.Group>
            <Form.Group>
              <Input
                Label="Nome do pacote"
                type="text"
                placeholder="Nome do pacote"
                variant={
                  modo === "edit" && encomendaData?.status == "ENTREGUE"
                    ? "Disabled"
                    : "Default"
                }
                defaultValue={nomePacote}
                onChange={(e) => setNomePacote(e.target.value)}
                disabled={
                  modo === "edit" && encomendaData?.status == "ENTREGUE"
                    ? true
                    : false
                }
              />
            </Form.Group>
            <Form.Group>
              <Input
                Label="Observação"
                type="text"
                placeholder="Observação"
                variant={
                  modo === "edit" && encomendaData?.status == "ENTREGUE"
                    ? "Disabled"
                    : "Default"
                }
                defaultValue={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                disabled={
                  modo === "edit" && encomendaData?.status == "ENTREGUE"
                    ? true
                    : false
                }
              />
            </Form.Group>

            <Form.Group>
              <Dropdown
                Label="Destinatário"
                options={moradorOptions}
                placeholder="Selecione um morador"
                value={moradorSelectId}
                isLoading={isLoading}
                onChange={handleMoradorChange}
                isDisabled={
                  modo === "edit" && encomendaData?.status == "ENTREGUE"
                    ? true
                    : false
                }
              />
            </Form.Group>
            <Input
              Label="Email do Destinatário"
              type="email"
              placeholder=""
              variant="Disabled"
              key={`email-${moradorSelectId}`}
              defaultValue={emailDestinatario}
              disabled={true}
            />
            {/* <Input
              Label="Número do Apartamento"
              type="text"
              variant="Disabled"
              placeholder=""
              key={`apt-${moradorSelectId}`}
              defaultValue={numeroApartamento}
              disabled={true}
            /> */}

            <Form.Group>
              <Dropdown
                Label="Bloco"
                name="idBloco"
                options={blocoOptions}
                placeholder={
                  moradorSelectId
                    ? "Selecione o bloco"
                    : "Selecione o campo anterior primeiro"
                }
                value={idBloco}
                isLoading={isBlocoLoading}
                onChange={handleBlocoChange}
                isDisabled={
                  !moradorSelectId ||
                  (modo === "edit" && encomendaData?.status == "ENTREGUE")
                }
              />
            </Form.Group>
            <Form.Group>
              <Dropdown
                Label="Moradia"
                name="idMoradia"
                options={moradiaOptions}
                placeholder={
                  idBloco
                    ? "Selecione a moradia"
                    : "Selecione o campo anterior primeiro"
                }
                value={idMoradia}
                isLoading={isMoradiaLoading}
                onChange={handleMoradiaChange}
                isDisabled={
                  !idBloco ||
                  (modo === "edit" && encomendaData?.status == "ENTREGUE")
                }
              />
            </Form.Group>
          </div>
        </div>
        {showButton && (
          <div className="px-4 pb-4 pt-2 flex-shrink-0">
            <Form.Check
              type="checkbox"
              label={
                <span style={{ color: "rgba(var(--alertColor), 1)" }}>
                  Foram detectadas avarias no pacote?
                </span>
              }
              className={Styles.CheckboxInput}
            />
            <hr className="pb-2" />
            {modo === "edit" && (
              <div className="d-flex flex-column gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-100"
                  onClick={onDeliver}
                >
                  Entregar encomenda
                </Button>

                <Button type="submit" variant="primary" className="w-100">
                  Salvar alterações
                </Button>
              </div>
            )}

            {modo === "add" && (
              <div className="d-flex flex-column gap-2">
                <Button type="submit" variant="primary" className="w-100">
                  Adicionar encomenda
                </Button>
              </div>
            )}
          </div>
        )}
      </Form>
    </div>
  );
}
