"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button/button";
import Input from "@/app/components/Input/Input";
import { solicitarRedefinicaoSenha } from "@/app/services/Auth/POST";

export default function EsqueciMinhaSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const valor = email.trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    if (!valor || !emailValido) {
      setError("Informe um e-mail válido.");
      setMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await solicitarRedefinicaoSenha(valor);

      setMessage("Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.");
    } catch (err) {
      setError(err?.message || "Não foi possível processar a solicitação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4 p-md-5">
          <h2 className="mb-3 fw-bold">Recuperar senha</h2>
          <p className="text-secondary mb-4">
            Informe o e-mail cadastrado para receber as instruções.
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="name@example.com"
              Label="E-mail"
              onChange={(event) => setEmail(event.target.value)}
            />

            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {error}
              </div>
            )}

            {message && (
              <div className="alert alert-success py-2 mb-3" role="alert">
                {message}
              </div>
            )}

            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={loading} className="flex-fill">
                {loading ? "Enviando..." : "Enviar"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/login")}
                className="flex-fill"
              >
                Voltar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
