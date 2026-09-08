"use client";
 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
 
export default function Home() {
  const router = useRouter();
  const [mensagem, setMensagem] = useState("Iniciando sistemas...");
 
  useEffect(() => {
    const verificarSistema = async () => {
      try {
        setMensagem("Verificando conexão com o servidor...");
 
        // TODO: reativar assim que o backend expuser essa rota
        // const resposta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);
        // if (!resposta.ok) throw new Error("Servidor offline");
 
        setMensagem("Tudo pronto! Redirecionando...");
        router.push("/pages/login");
      } catch (erro) {
        setMensagem("Erro: O servidor Back-end parece estar offline.");
        console.error(erro);
      }
    };
 
    verificarSistema();
  }, [router]);
 
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div
        className="spinner-border text-primary mb-4"
        role="status"
        style={{ width: "4rem", height: "4rem" }}
      >
        <span className="visually-hidden">Carregando...</span>
      </div>
 
      <h2 className="text-secondary fw-bold text-center">{mensagem}</h2>
 
      {mensagem.includes("Erro") && (
        <button
          className="btn btn-warning mt-4"
          onClick={() => window.location.reload()}
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
}