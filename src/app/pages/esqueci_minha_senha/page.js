"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Image from "next/image";
import { solicitarRedefinicaoSenha } from "@/features/auth/services/authPOST";
import LiquidGlassFilter from "@/components/ui/LiquidGlassFilter/LiquidGlassFilter";
import styles from "./page.module.css";

export default function EsqueciMinhaSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedEmail || !checkEmail) {
      setError("Por favor, insira um e-mail válido.");
      setMessage("");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");
      await solicitarRedefinicaoSenha(trimmedEmail);
      setMessage(
        "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.",
      );
    } catch (err) {
      setError(
        err.message || "Ocorreu um erro ao solicitar a redefinição de senha.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.body}>
      {/* Define o filtro de refração — não renderiza nada visível.
          width/height devem bater com o tamanho real do .modalContent;
          meça no DevTools e ajuste se necessário. */}
      <LiquidGlassFilter id="lg-filter" width={480} height={620} radius={20} inset={6} scale={70} />

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
            <div className="text-center mt-3 mb-4">
              <h2 className="fw-bold mb-2" style={{ color: "#1a1a1a" }}>
                Recuperação de senha!
              </h2>
              <p className="text-secondary mb-0">
                Informe o e-mail cadastrado para receber as instruções.
              </p>
            </div>

            <form className="w-100" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                Label="Email"
                onChange={(e) => setEmail(e.target.value)}
                Disabled={loading}
              />

              <div
                className="pt-1 mb-3"
                style={{ width: "100%", minHeight: "150px" }}
              >
                {error && (
                  <div className="alert alert-danger py-2 mb-0" role="alert">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="alert alert-success py-2 mb-0" role="alert">
                    {message}
                  </div>
                )}
              </div>

              <div className="d-flex flex-column gap-2 mt-3">
                <Button type="submit" disabled={loading} className="w-100">
                  {loading ? "Enviando..." : "Enviar"}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => router.push("/login")}
                  className="w-100"
                >
                  Voltar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}