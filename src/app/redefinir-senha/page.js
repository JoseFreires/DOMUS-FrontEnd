export { default } from "../pages/recuperarSenha/page";

//essa pagina existe como um alias para a rota /redefinir-senha, que é a rota que o backend envia no email de redefinição de senha.
//ambas estão abertas no proxy sem necessidade de validação.
// ver com o time de back se teria como mudar a rota que o backend envia no email, para que seja /pages/recuperarSenha mesmo, e não /redefinir-senha.