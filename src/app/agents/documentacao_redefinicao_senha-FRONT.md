# Documentação Técnica: Integração do Frontend para Redefinição de Senha

## 1. Objetivo

Esta documentação define exatamente o que o frontend precisa implementar para se integrar corretamente ao fluxo de redefinição de senha descrito no backend, sem token temporário e sem validação por token na API.

A ideia principal é: o frontend deve apenas coletar e enviar os dados necessários, tratar mensagens neutras do backend, validar regras de UX e seguir o fluxo de autenticação tradicional do sistema.

---

## 2. Visão geral do fluxo

O backend implementa o seguinte modelo:

- o usuário informa apenas o e-mail para solicitar recuperação;
- se o e-mail existir, o backend envia e-mail com instruções;
- se não existir, responde com mensagem genérica para não vazar o cadastro;
- a troca de senha é feita em rota pública sem token;
- o frontend precisa enviar `email`, `novaSenha` e `confirmarSenha` na etapa de redefinição;
- após trocar a senha, o usuário retorna ao login e autentica com a nova senha.

Consequência para o frontend:

- não existe token de reset no front;
- não existe tela de “validar link” com token;
- o link do e-mail deve apenas abrir a tela de redefinição, sem depender de backend para validar sessão;
- a tela de redefinição precisa pedir e-mail junto com a nova senha para identificar o usuário.

---

## 3. Fluxos de interface que o frontend precisa suportar

### 3.1 Fluxo A: Usuário esqueceu a senha

1. O usuário acessa a tela de login.
2. Clica em “Esqueci minha senha”.
3. A tela solicita o e-mail cadastrado.
4. O frontend envia:

```json
{
  "email": "usuario@domus.com"
}
```

5. O backend responde com status `202 Accepted` e mensagem genérica.
6. O frontend exibe mensagem amigável, por exemplo:
   - “Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.”
7. Não deve haver diferença visual entre e-mail existente e inexistente.

### 3.2 Fluxo B: Usuário acessa o link do e-mail

1. O e-mail enviado pelo backend contém um link para uma tela do frontend.
2. Esse link deve levar para a página de redefinição de senha.
3. A tela deve permitir que o usuário informe:
   - e-mail;
   - nova senha;
   - confirmação da senha.
4. O frontend não precisa validar token no backend.

### 3.3 Fluxo C: Confirmação da nova senha

1. O usuário preenche os campos.
2. O frontend valida as regras locais antes de enviar.
3. Chama o endpoint de redefinição:

```http
PUT /auth/redefinir-senha
```

4. Se a resposta for sucesso (`204 No Content`), o frontend mostra mensagem de sucesso e redireciona para login.
5. O usuário precisa autenticar manualmente com a nova senha.

---

## 4. Endpoints esperados e contrato de integração

### 4.1 POST /auth/esqueci-minha-senha

Endpoint de solicitação de redefinição.

Request:

```json
{
  "email": "usuario@domus.com"
}
```

Resposta esperada em sucesso:

```http
HTTP/1.1 202 Accepted
Content-Type: application/json
```

```json
{
  "message": "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
}
```

Observações para o frontend:

- o retorno é sempre neutro;
- o frontend não deve “confirmar” que o e-mail existe;
- mostrar mensagem genérica para qualquer resultado sem revelar detalhes.

### 4.2 PUT /auth/redefinir-senha

Endpoint de efetivação da troca de senha.

Request:

```json
{
  "email": "usuario@domus.com",
  "novaSenha": "SenhaForte@123",
  "confirmarSenha": "SenhaForte@123"
}
```

Resposta esperada em sucesso:

```http
HTTP/1.1 204 No Content
```

Possíveis erros:

- `400 Bad Request`: payload inválido ou senha fora dos critérios;
- `429 Too Many Requests`: abuso de tentativa;
- `500 Internal Server Error`: erro inesperado.

Observações para o frontend:

- não há token na rota;
- o e-mail deve ser enviado novamente no payload;
- o frontend precisa garantir que os campos existam e tenham conteúdo antes de enviar;
- não existe resposta com dados do usuário para preencher sessão automaticamente.

---

## 5. Regras de validação no frontend

O frontend precisa validar antes de enviar para evitar erros desnecessários e melhorar a UX.

### 5.1 Validação no formulário de recuperação

Campos:

- `email`

Regras:

- campo obrigatório;
- e-mail válido;
- sem espaços extras;
- tratar trim antes do envio.

Mensagem sugerida:

- “Informe um e-mail válido.”

### 5.2 Validação no formulário de redefinição

Campos:

- `email`;
- `novaSenha`;
- `confirmarSenha`.

Regras:

- `email` obrigatório e válido;
- `novaSenha` obrigatória;
- `confirmarSenha` obrigatória;
- `novaSenha` e `confirmarSenha` devem ser iguais;
- senha com no mínimo 8 caracteres;
- pelo menos 1 letra maiúscula;
- pelo menos 1 letra minúscula;
- pelo menos 1 número;
- idealmente, evitar texto “fraco” ou muito comum;
- não permitir envio com campos vazios.

Mensagem sugerida:

- “As senhas informadas não conferem.”
- “A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.”

### 5.3 UX no frontend

A tela de redefinição deve indicar:

- força da senha;
- se as senhas conferem;
- se a submissão está em progresso;
- quando a senha foi alterada com sucesso;
- quando o backend retornou erro por regra de validação.

---

## 6. Estrutura de telas e componentes esperados

### 6.1 Tela de login

A tela de login deve conter:

- campo de e-mail/usuário;
- campo de senha;
- botão de login;
- link “Esqueci minha senha”.

A action do link deve navegar para uma tela de recuperação.

### 6.2 Tela “Esqueci minha senha”

Campos:

- e-mail

Botões:

- enviar solicitação;
- voltar para login.

Comportamento:

- enviar `POST /auth/esqueci-minha-senha`;
- bloquear múltiplos envios enquanto a requisição estiver em andamento;
- mostrar mensagem genérica após sucesso.

### 6.3 Tela de redefinição de senha

Campos:

- e-mail;
- nova senha;
- confirmar senha.

Botões:

- salvar nova senha;
- cancelar/voltar ao login.

Comportamento:

- chamar `PUT /auth/redefinir-senha`;
- exibir loading;
- em sucesso, mostrar “Senha redefinida com sucesso”;
- redirecionar para login sem autenticar automaticamente.

---

## 7. Rotas e navegação esperadas

O backend não possui token ou redirecionamento automático após a troca.

Logo, o frontend precisa decidir a navegação.

Rota recomendada:

- `/login` → tela de autenticação;
- `/esqueci-minha-senha` → tela de solicitação;
- `/redefinir-senha` → tela de atualização.

Comportamento após a troca:

- redirecionar para `/login`;
- opcionalmente mostrar mensagem “Sua senha foi atualizada. Faça login novamente.”;
- não preservar sessão ou token da redefinição.

---

## 8. Integração com serviços no frontend

O projeto já possui uma organização de serviços e hooks. O frontend precisa seguir esse padrão para manter consistência.

### 8.1 Serviços esperados

Estrutura sugerida:

- `src/services/Auth/GET.js`
- `src/services/Auth/POST.js`
- `src/services/Auth/Logout/POST.js`

Se a autenticação for centralizada no mesmo módulo, o frontend pode organizar assim:

- `Auth/redefinicaoSenha.js` ou um módulo interno para `POST esqueci-minha-senha` e `PUT redefinir-senha`.

### 8.2 Padrão de consumo

O frontend deve utilizar:

- `fetch` ou client HTTP já configurado no projeto;
- tratar `status` e `json` corretamente;
- não assumir que o backend sempre retornará um corpo com sucesso.

Exemplo conceitual:

```js
async function solicitarRecuperacao(email) {
  const response = await fetch('/auth/esqueci-minha-senha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  return response;
}
```

```js
async function redefinirSenha({ email, novaSenha, confirmarSenha }) {
  const response = await fetch('/auth/redefinir-senha', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, novaSenha, confirmarSenha })
  });

  return response;
}
```

---

## 9. Tratamento de erros do frontend

O frontend precisa interpretar corretamente as respostas do backend.

### 9.1 Cenários esperados e UX

- `202 Accepted` para recuperação → exibir mensagem genérica de sucesso.
- `204 No Content` para redefinição → exibir sucesso e redirect para login.
- `400 Bad Request` → mostrar a mensagem de erro do backend, se vier em `message`, ou mensagem padrão do formulário.
- `429 Too Many Requests` → mostrar “Muitas tentativas. Tente novamente mais tarde.”
- `500` → mostrar erro genérico e orientar o usuário a tentar novamente.

### 9.2 Não fazer no frontend

- não revelar se o e-mail existe ou não;
- não exibir mensagens “usuário não cadastrado”;
- não confiar em token de URL;
- não considerar a redefinição como login automático.

---

## 10. Estado de loading e desabilitação de botões

Para evitar abuso e melhorar a experiência:

- desabilitar botão de envio enquanto aguarda resposta;
- limitar novo envio ao backend durante alguns segundos;
- evitar múltiplos cliques;
- quando houver erro `429`, bloquear a tentativa por um tempo e mostrar mensagem clara.

Recomendação:

- `isSubmitting` para estados de loading;
- `isDisabled` para inputs e botões enquanto processando;
- feedback visual de sucesso/erro por campo.

---

## 11. Mensagens e copy do front

O frontend deve manter mensagens neutras e consistentes com a política de segurança do backend.

### 11.1 Mensagem de solicitação de redefinição

Recomendado:

- “Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.”

### 11.2 Mensagem de sucesso da redefinição

Recomendado:

- “Senha redefinida com sucesso.”
- “Faça login com a sua nova senha.”

### 11.3 Mensagem de erro de validação

Recomendado:

- “As senhas informadas não conferem.”
- “A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.”

---

## 12. Checklist de implementação do frontend

### Tela de login

- [ ] Adicionar link “Esqueci minha senha”
- [ ] Navegar para tela de recuperação
- [ ] manter login atual funcionando sem alterações

### Tela de recuperação

- [ ] Campo de e-mail
- [ ] Validação de e-mail
- [ ] Chamada para `POST /auth/esqueci-minha-senha`
- [ ] Mensagem neutra em caso de sucesso
- [ ] Loading e bloqueio de reenvio
- [ ] Tratamento de erro 400/429/500

### Tela de redefinição

- [ ] Campo de e-mail
- [ ] Campo de nova senha
- [ ] Campo de confirmação
- [ ] Validação de força da senha
- [ ] Validação de igualdade entre campos
- [ ] Chamada para `PUT /auth/redefinir-senha`
- [ ] Sucesso com redirecionamento para login
- [ ] Sem autenticação automática
- [ ] Tratamento de erros da API

### UX geral

- [ ] Mensagens claras e consistentes
- [ ] Feedback visual de carregamento
- [ ] Redirecionamento sem token
- [ ] Navegação segura e sem vazamento de dados

---

## 13. Observações importantes para o front

1. O backend não gera token temporário para redefinição.
2. O link do e-mail apenas leva para a página do frontend.
3. A página de redefinição precisa pedir o e-mail novamente.
4. A troca de senha não exige autenticação em sessão.
5. O frontend não deve assumir que o backend retornará payloads de usuário.
6. A segurança da funcionalidade depende mais de validações no frontend + backend do que de fluxo com token.
7. O sucesso da operação termina com o usuário autenticando manualmente no sistema.

---

## 14. Recomendação de implementação prática no projeto atual

No contexto do projeto em Next.js com estrutura em `src/app`, o ideal é:

- criar ou ajustar a tela de login em `src/app/login/page.js`;
- criar a tela de recuperação em uma rota tipo `/esqueci-minha-senha` ou no mesmo módulo de autenticação;
- criar a tela de redefinição em uma rota tipo `/redefinir-senha`;
- centralizar chamadas em `src/services/Auth/` ou em um módulo específico de autenticação;
- reutilizar os componentes de `Input`, `Button` e `Modal` já existentes;
- manter as mensagens em português, neutras e compatíveis com o padrão do restante da aplicação.

---

## 15. Conclusão

Para que a integração funcione corretamente, o frontend precisa ajustar o fluxo para o modelo sem token implementado pelo backend:

- usar e-mail como identificador;
- não depender de validação de token na URL;
- manter respostas genéricas e não vazar informações de cadastro;
- validar a nova senha antes do envio;
- redirecionar o usuário de volta para o login após a confirmação;
- tratar mensagens e erros de forma consistente.

Com isso, a comunicação entre frontend e backend fica compatível com o contrato atual e segura para o usuário.
