"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/app/components/Button/button";
import Input from "@/app/components/Input/Input";
import { redefinirSenha } from "@/app/services/Auth/POST";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams?.get("token");

  const [token, setToken] = useState(null);
  const [form, setForm] = useState({
    novaSenha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(String(tokenFromUrl));
    }
  }, [tokenFromUrl]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token) {
      setError("O link de recuperação é inválido. Solicite uma nova redefinição de senha.");
      setSuccess("");
      return;
    }

    const novaSenha = form.novaSenha;
    const confirmarSenha = form.confirmarSenha;

    if (!novaSenha) {
      setError("Informe a nova senha.");
      setSuccess("");
      return;
    }

    if (!confirmarSenha) {
      setError("Confirme a nova senha.");
      setSuccess("");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError("As senhas informadas não coincidem.");
      setSuccess("");
      return;
    }

    const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(novaSenha);
    if (!senhaValida) {
      setError("A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await redefinirSenha({ token, novaSenha, confirmarSenha });

      setSuccess("Senha redefinida com sucesso. Você será redirecionado para o login.");

      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err) {
      setError(err?.message || "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  // Mensagem quando não houver token
  if (!token) {
    return (
      <div className="container py-5" style={{ maxWidth: 520 }}>
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="mb-3 fw-bold">Redefinir senha</h2>
            <p className="text-secondary mb-4">O link de recuperação é inválido. Solicite uma nova redefinição de senha.</p>
            <div className="d-flex gap-2 mt-3">
              <Button onClick={() => router.push('/esqueci-minha-senha')} className="flex-fill">Solicitar novo link</Button>
              <Button variant="secondary" onClick={() => router.push('/login')} className="flex-fill">Voltar ao login</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4 p-md-5">
          <h2 className="mb-3 fw-bold">Redefinir senha</h2>
          <p className="text-secondary mb-4">Informe a nova senha.</p>

          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="Nova senha"
              Label="Nova senha"
              name="novaSenha"
              onChange={handleChange}
              autoComplete="new-password"
            />

            <Input
              type="password"
              placeholder="Confirmar senha"
              Label="Confirmar senha"
              name="confirmarSenha"
              onChange={handleChange}
              autoComplete="new-password"
            />

            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2 mb-3" role="alert">
                {success}
              </div>
            )}

            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={loading} className="flex-fill">
                {loading ? "Redefinindo..." : "Redefinir senha"}
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
        </div>
      </div>
    </div>
  );
}
