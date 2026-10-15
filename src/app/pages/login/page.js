"use client";

import styles from "./page.module.css";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../auth";

import Image from "next/image";

import TermosModal from "@/components/ui/Modal/TermosModal/TermosModal";
import { aceitarTermosDeUso } from "@/features/auth/services/authPUT";

export default function Login() {
  const router = useRouter();
  const { signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showTermos, setShowTermos] = useState(false);
  const [destino, setDestino] = useState(null);
  const [aceitando, setAceitando] = useState(false);
  const [erroTermos, setErroTermos] = useState("");


  const HOME_BY_ROLE = {
    ROLE_SINDICO: "/pages/home/sindico",
    ROLE_PORTEIRO: "/pages/home/porteiro",
    ROLE_MORADOR: "/pages/home/morador",
    ROLE_ADMIN: "/pages/home/sindico",
  };

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { loginData, user } = await signIn(email, password);

      const proximaRota = HOME_BY_ROLE[user?.role] ?? "/pages/home/porteiro";
      const termosAceitos = user?.termosAceitos ?? loginData?.termosAceitos;

      if (termosAceitos === false) {
        setDestino(proximaRota);
        setErroTermos("");
        setShowTermos(true);
        return;
      }
      router.push(proximaRota);
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  }

  async function handleAceitarTermos() {
    setAceitando(true);
    setErroTermos("");
    try {
      await aceitarTermosDeUso();
      router.push(destino);
    } catch (error) {
      setErroTermos(error.message || "Não foi possível registrar o aceite. Tente novamente.");
      setAceitando(false);
    }
  }

  async function handleRecusarTermos() {
    setShowTermos(false);
    setDestino(null);
    setErroTermos("");
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.form}>
        < div className={styles.login}>
          <div className="modal-content rounded-4" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0rem",
          }}>
            <Image
              src="/img/logoDOMUS.png"
              alt="Login"
              width={97}
              height={100}
            />
            <div className="modal-header p-3 p-md-5 pb-3 pb-md-4 border-bottom-0">

              <div className="d-flex justify-content-center align-items-center gap-2">
                <p className="mb-0 text-center fs-4 text-dark">
                  Bem vindo ao
                </p>

                <span
                  className="fs-2 fw-bold "
                  style={{ color: "var(--primaryColor)" }}
                >
                  Domus!
                </span>
              </div>
            </div>
            <div className="modal-body p-3 p-md-5 pt-0">
              <form className="">
                <div className="d-flex flex-column gap-2">

                  <Input
                    type="email"
                    className="form-control rounded-3 "
                    id="floatingInput"
                    placeholder="name@example.com"
                    Label="Endereço de email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    className="form-control rounded-3"
                    id="floatingPassword"
                    placeholder="Password"
                    Label="Senha"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div
                    className="pt-2 mb-4"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <a
                      className="text-decoration-none"
                      style={{ color: "var(--primaryColor)" }}
                      href="/pages/esqueci_minha_senha"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                </div>
                <Button
                  className="w-100 mb-4"
                  onClick={(e) => handleLogin(e)}
                >
                  <span>Entrar</span>

                </Button>

                <hr className="my-4" />
                <div className="text-center">
                  <p className="text-decoration-none">
                    Não tem uma conta? contate seu sindico
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.loginImg}>
        <img
          src="/img/imagemIlustrativa_telaAcesso.png"
          alt="Login"
          className={styles.art}
        />
      </div>


      <TermosModal
        show={showTermos}
        onAccept={handleAceitarTermos}
        onDecline={handleRecusarTermos}
        loading={aceitando}
        error={erroTermos}
      />
    </div>
  );
}
