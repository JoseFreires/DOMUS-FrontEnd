"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { redefinirSenha } from "@/features/auth/services/authPOST";
import { useFormValidation } from "@/hooks/useFormValidation";
import { required, matches, strongPassword } from "@/utils/validators";

import LiquidGlassFilter from "@/components/ui/LiquidGlassFilter/LiquidGlassFilter";
import styles from "./page.module.css";

const initialValues = { novaSenha: "", confirmarSenha: "" };
const validationRules = {
  novaSenha: [required("Informe a nova senha."), strongPassword()],
  confirmarSenha: [
    required("Confirme a nova senha."),
    matches("novaSenha", "As senhas não coincidem."),
  ],
};

const LINK_ERROR_STATUS = [400, 409, 410];
const LINK_INVALID_MSG =
  "O link de recuperação é inválido. Solicite uma nova redefinição de senha.";

function RedefinirSenha() {
  const router = useRouter();

  const token = useSearchParams().get("token");

  const { values, errors, handleChange, validateAll, setFieldError } =
    useFormValidation(initialValues, validationRules);

  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    if (status !== "sucess") return;
    const timer = setTimeout(() => router.push("/login"), 1800);
    return () => clearTimeout(timer);
  }, [status, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!validateAll()) return;
    setStatus("loading");

    try {
      await redefinirSenha({ token, ...values });
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      if (LINK_ERROR_STATUS.includes(err.status)) setLinkError(err.message);
      else if (err.status === 422) setFieldError("novaSenha", err.message);
      else setFormError(err.message || "Não foi possível redefinir a senha.");
    }
  }

  const invalidLink = !token || linkError;

  return (
    <div className={styles.body}>
      {/* Define o filtro de refração — não renderiza nada visível.
          width/height devem bater com o tamanho real do .modalContent;
          meça no DevTools e ajuste se necessário. */}
      <LiquidGlassFilter
        id="lg-filter"
        width={480}
        height={650}
        radius={20}
        inset={6}
        scale={70}
      />

      <div className={styles.loginImg}>
        <img
          src="/img/imagemIlustrativa_telaAcesso.png"
          alt=""
          className={styles.art}
        />
      </div>

      <div className={styles.form}>
        <div className={styles.login}>
          <div
            className={`modal-content rounded-4 shadow-sm p-4 p-md-5 ${styles.modalContent}`}
          >
            <div className="d-flex justify-content-center align-items-center gap-2">
              <Image
                src="/img/logoDOMUS.png"
                alt="Domus"
                width={97}
                height={100}
              />
              <span
                className="fs-2 fw-bold "
                style={{ color: "var(--primaryColor)" }}
              >
                Domus!
              </span>
            </div>
            <div className="container py-5 d-flex flex-column  align-items-center gap-2" style={{ maxWidth: 520 }}>
              <h2 className="mb-3 fw-bold">Alteração da senha</h2>

              {invalidLink ? (
                <>
                  <p className="text-secondary mb-4">
                    {linkError || LINK_INVALID_MSG}
                  </p>
                  <div className="d-flex gap-2">
                    <Button
                      onClick={() => router.push("/esqueci-minha-senha")}
                      className="flex-fill"
                    >
                      Solicitar novo link
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => router.push("/login")}
                      className="flex-fill"
                    >
                      Voltar ao login
                    </Button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="justify-content-space-between d-flex flex-column gap-2 w-100">

                  <div style={{ fontSize: "0.9rem", color: "#6c757d", minHeight: "100px" }} className="mb-3">
                    A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
                  </div>
                  <Input
                    type="password"
                    name="novaSenha"
                    Label="Nova senha"
                    placeholder="Nova senha"
                    autoComplete="new-password"
                    onChange={handleChange}
                    error={errors.novaSenha}
                  />
                  <Input
                    type="password"
                    name="confirmarSenha"
                    Label="Confirmar senha"
                    placeholder="Confirmar senha"
                    autoComplete="new-password"
                    onChange={handleChange}
                    error={errors.confirmarSenha}
                  />

                  {formError && (
                    <div className="alert alert-danger py-2" role="alert">
                      {formError}
                    </div>
                  )}
                  {status === "success" && (
                    <div className="alert alert-success py-2" role="alert">
                      Senha redefinida com sucesso. Você será redirecionado para
                      o login.
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-3">
                    <Button
                      type="submit"
                      disabled={status !== "idle"}
                      className="flex-fill"
                    >
                      {status === "loading"
                        ? "Redefinindo..."
                        : "Redefinir senha"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => router.push("/login")}
                      className="flex-fill"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={null}>
      <RedefinirSenha />
    </Suspense>
  );
}
