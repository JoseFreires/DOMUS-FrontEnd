# Documento Técnico - Ajuste Front-End do Fluxo de Redefinição de Senha

## 1. Objetivo

Adequar o front-end do fluxo de redefinição de senha para que o usuário não precise informar novamente seu e-mail após acessar o link recebido.

A identificação do usuário será feita por meio do token presente na URL de redefinição. A tela deverá solicitar apenas a nova senha e a confirmação da nova senha.

---

## 2. Escopo

Este ajuste contempla:

- remoção do campo de e-mail da tela de redefinição de senha;
- leitura do token presente na URL;
- validação da existência do token antes da exibição ou envio do formulário;
- alteração do payload enviado ao backend;
- validação da nova senha e da confirmação de senha;
- tratamento dos retornos de token inválido, expirado ou já utilizado;
- exibição de mensagem de sucesso;
- redirecionamento para a tela de login após a redefinição.

Este documento não contempla a implementação interna do backend responsável por gerar, validar, expirar ou invalidar o token.

---

## 3. Cenário atual

### 3.1. Fluxo atual

```text
Usuário solicita a recuperação de senha
        ↓
Usuário informa o e-mail
        ↓
Sistema envia o link de recuperação
        ↓
Usuário acessa o link
        ↓
Front-end solicita novamente o e-mail
        ↓
Usuário informa a nova senha
        ↓
Front-end envia e-mail e nova senha ao backend
```

### 3.2. Campos atuais da tela

```text
E-mail
Nova senha
Confirmar senha
```

### 3.3. Exemplo do payload atual

```json
{
  "email": "usuario@empresa.com",
  "novaSenha": "NovaSenha123"
}
```

### 3.4. Problemas identificados

- O e-mail é solicitado duas vezes durante o mesmo fluxo.
- O usuário pode informar um e-mail diferente daquele usado na solicitação inicial.
- A etapa adicional aumenta a possibilidade de erro de preenchimento.
- A tela depende de uma informação que pode ser obtida pelo token de recuperação.

---

## 4. Solução proposta

O link enviado ao usuário deverá conter um token de redefinição de senha.

### Exemplo de URL

```text
https://sistema.com.br/redefinir-senha?token=abc123xyz
```

O front-end deverá capturar o token da URL e enviá-lo ao backend junto com a nova senha.

O e-mail não deverá ser solicitado novamente na tela de redefinição.

---

## 5. Novo fluxo

```text
Usuário solicita a recuperação de senha
        ↓
Usuário informa o e-mail
        ↓
Sistema envia um link contendo o token
        ↓
Usuário acessa o link
        ↓
Front-end captura o token da URL
        ↓
Front-end exibe os campos de nova senha
        ↓
Usuário informa e confirma a nova senha
        ↓
Front-end envia token e nova senha ao backend
        ↓
Backend valida o token e altera a senha
        ↓
Front-end exibe a confirmação
        ↓
Usuário é redirecionado para o login
```

---

## 6. Alterações necessárias no front-end

### 6.1. Remover o campo de e-mail

Remover da tela de redefinição:

```text
E-mail
```

O e-mail não deverá fazer parte do estado do formulário, das validações da tela nem do payload enviado ao backend.

### 6.2. Manter os campos de senha

A tela deverá conter:

```text
Nova senha
Confirmar senha
```

### 6.3. Layout funcional esperado

```text
-----------------------------------
Redefinição de senha
-----------------------------------

Nova senha
[________________________]

Confirmar senha
[________________________]

[ Redefinir senha ]
```

Recomenda-se disponibilizar a opção de mostrar ou ocultar o conteúdo dos campos de senha.

---

## 7. Captura do token

Ao carregar a página, o front-end deverá obter o parâmetro `token` da URL.

### Exemplo usando JavaScript

```javascript
const parametros = new URLSearchParams(window.location.search);
const token = parametros.get("token");
```

Para a URL abaixo:

```text
/redefinir-senha?token=abc123xyz
```

O valor capturado será:

```text
abc123xyz
```

### Regras para armazenamento no front-end

- Manter o token somente durante o fluxo de redefinição.
- Preferir armazenamento em memória ou no estado do componente.
- Não registrar o token em logs do navegador.
- Não exibir o valor do token na interface.
- Evitar salvar o token em armazenamento persistente, como `localStorage`, quando não houver necessidade.

---

## 8. Validação inicial da página

### 8.1. Token presente

Quando o parâmetro `token` estiver presente:

- permitir a exibição do formulário;
- armazenar o token no estado da página;
- permitir o preenchimento da nova senha.

### 8.2. Token ausente

Quando o parâmetro `token` não estiver presente:

- não permitir o envio do formulário;
- exibir uma mensagem de link inválido;
- disponibilizar uma ação para solicitar um novo link.

### Mensagem sugerida

```text
O link de recuperação é inválido. Solicite uma nova redefinição de senha.
```

### 8.3. Validação antecipada opcional

Caso o backend disponibilize um endpoint para consulta da validade do token, o front-end poderá validá-lo ao carregar a página.

Essa validação antecipada melhora a experiência do usuário, mas não substitui a validação obrigatória no momento da redefinição.

---

## 9. Validações do formulário

Antes de enviar a solicitação, validar:

- preenchimento da nova senha;
- preenchimento da confirmação de senha;
- igualdade entre os dois campos;
- atendimento aos requisitos de senha definidos pelo sistema;
- existência do token na URL ou no estado da página.

### Mensagens sugeridas

#### Nova senha não preenchida

```text
Informe a nova senha.
```

#### Confirmação não preenchida

```text
Confirme a nova senha.
```

#### Senhas diferentes

```text
As senhas informadas não coincidem.
```

#### Senha fora dos requisitos

```text
A senha informada não atende aos requisitos de segurança.
```

Os requisitos de senha exibidos na interface devem ser equivalentes às regras aplicadas pelo backend.

---

## 10. Alteração da integração com a API

### 10.1. Payload anterior

```json
{
  "email": "usuario@empresa.com",
  "novaSenha": "NovaSenha123"
}
```

### 10.2. Novo payload

```json
{
  "token": "abc123xyz",
  "novaSenha": "NovaSenha123"
}
```

O campo de confirmação de senha pode permanecer apenas no front-end para validação. Ele somente deverá ser enviado caso o contrato definido pelo backend também exija esse valor.

### 10.3. Exemplo com confirmação exigida pela API

```json
{
  "token": "abc123xyz",
  "novaSenha": "NovaSenha123",
  "confirmacaoSenha": "NovaSenha123"
}
```

### 10.4. Cabeçalhos esperados

```http
Content-Type: application/json
```

### 10.5. Comportamento durante a requisição

Enquanto a solicitação estiver em andamento, o front-end deverá:

- desabilitar o botão de envio;
- impedir envios duplicados;
- exibir um indicador de carregamento;
- preservar uma mensagem de erro clara se a operação falhar.

---

## 11. Tratamento das respostas da API

Os códigos HTTP apresentados abaixo são sugestões. O front-end deverá seguir o contrato efetivamente definido pelo backend.

### 11.1. Redefinição realizada com sucesso

Possíveis códigos:

```text
200 OK
204 No Content
```

Mensagem sugerida:

```text
Senha alterada com sucesso.
```

Após o sucesso:

1. limpar os dados do formulário;
2. remover o token mantido no estado da aplicação;
3. impedir novo envio com o mesmo formulário;
4. redirecionar o usuário para a tela de login.

Rota sugerida:

```text
/login
```

### 11.2. Token inválido

Possível código:

```text
400 Bad Request
```

Mensagem sugerida:

```text
O link de recuperação é inválido. Solicite uma nova redefinição de senha.
```

### 11.3. Token expirado

Possível código:

```text
410 Gone
```

Mensagem sugerida:

```text
O link de recuperação expirou. Solicite uma nova redefinição de senha.
```

### 11.4. Token já utilizado

Possíveis códigos:

```text
400 Bad Request
409 Conflict
```

Mensagem sugerida:

```text
Este link de recuperação já foi utilizado. Solicite uma nova redefinição de senha.
```

### 11.5. Nova senha inválida

Possível código:

```text
422 Unprocessable Entity
```

Mensagem sugerida:

```text
A nova senha não atende aos requisitos de segurança.
```

### 11.6. Erro inesperado

Possível código:

```text
500 Internal Server Error
```

Mensagem sugerida:

```text
Não foi possível redefinir a senha. Tente novamente mais tarde.
```

Não exibir mensagens internas, exceções, detalhes técnicos ou informações sensíveis retornadas pelo servidor.

---

## 12. Estados esperados da interface

A tela deverá prever os seguintes estados:

### Carregamento inicial

Utilizado enquanto o token é capturado ou validado.

```text
Validando link de recuperação...
```

### Formulário disponível

Exibir os campos de nova senha e confirmação.

### Envio em andamento

Desabilitar o botão e exibir mensagem ou indicador visual.

```text
Redefinindo senha...
```

### Erro de validação

Exibir o erro próximo ao campo correspondente ou em uma área de mensagem acessível.

### Link inválido ou expirado

Bloquear o formulário e disponibilizar uma ação para solicitar novo link.

### Sucesso

Exibir a confirmação antes do redirecionamento para o login.

---

## 13. Requisitos de experiência e acessibilidade

- Associar cada campo ao seu respectivo rótulo.
- Permitir navegação por teclado.
- Informar erros de forma textual, sem depender apenas de cores.
- Direcionar o foco para a mensagem de erro quando necessário.
- Utilizar `autocomplete="new-password"` nos campos de nova senha.
- Exibir os requisitos de senha antes do envio.
- Informar visualmente quando o formulário estiver sendo processado.
- Evitar revelar se determinado e-mail existe ou não no sistema em etapas anteriores do fluxo.

---

## 14. Segurança no front-end

O front-end deverá observar as seguintes medidas:

- não exibir o token na tela;
- não incluir o token em mensagens de erro;
- não registrar o token em logs;
- não enviar o token para serviços de telemetria ou analytics;
- não reutilizar o token após a conclusão do processo;
- limpar estados sensíveis depois do sucesso;
- utilizar exclusivamente HTTPS nos ambientes publicados;
- não considerar validações do front-end como substitutas das validações do backend.

> O backend continua sendo responsável pela validação definitiva do token, de sua expiração, de seu uso anterior e das regras da nova senha.

---

## 15. Rotas envolvidas

### Rota de redefinição

```text
/redefinir-senha?token={token}
```

### Rota de login

```text
/login
```

### Rota para nova solicitação

```text
/esqueci-minha-senha
```

Os nomes podem ser ajustados de acordo com o padrão de rotas já adotado pelo projeto.

---

## 16. Critérios de aceite

- [ ] O campo de e-mail foi removido da tela de redefinição.
- [ ] O token é capturado automaticamente pela URL.
- [ ] O token não é exibido na interface.
- [ ] O formulário é bloqueado quando o token está ausente.
- [ ] A nova senha é obrigatória.
- [ ] A confirmação de senha é obrigatória.
- [ ] O front-end valida se as senhas coincidem.
- [ ] O payload não envia mais o e-mail.
- [ ] O novo payload envia o token e a nova senha.
- [ ] O botão é bloqueado durante o envio.
- [ ] Envios duplicados são impedidos.
- [ ] Token inválido é tratado corretamente.
- [ ] Token expirado é tratado corretamente.
- [ ] Token já utilizado é tratado corretamente.
- [ ] Erros de validação da senha são apresentados ao usuário.
- [ ] A mensagem de sucesso é exibida após a alteração.
- [ ] O usuário é redirecionado para o login após o sucesso.
- [ ] Existe uma opção para solicitar um novo link quando o token não pode ser utilizado.

---

## 17. Cenários mínimos de teste

### Cenário 1 - Redefinição com sucesso

**Dado** que o usuário acessou a página com um token válido  
**Quando** informar e confirmar uma nova senha válida  
**Então** o front-end deverá enviar o token e a nova senha, exibir sucesso e redirecionar para o login.

### Cenário 2 - URL sem token

**Dado** que o usuário acessou a página sem o parâmetro `token`  
**Quando** a página for carregada  
**Então** o formulário deverá ser bloqueado e uma mensagem de link inválido deverá ser exibida.

### Cenário 3 - Senhas diferentes

**Dado** que o formulário está disponível  
**Quando** a nova senha e a confirmação forem diferentes  
**Então** a requisição não deverá ser enviada e o usuário deverá ser informado.

### Cenário 4 - Token expirado

**Dado** que a API informou que o token expirou  
**Quando** o front-end receber a resposta  
**Então** deverá bloquear uma nova tentativa com o mesmo token e oferecer a solicitação de outro link.

### Cenário 5 - Token já utilizado

**Dado** que a API informou que o token já foi utilizado  
**Quando** o front-end receber a resposta  
**Então** deverá informar o usuário e oferecer a solicitação de outro link.

### Cenário 6 - Erro inesperado

**Dado** que ocorreu uma falha inesperada na API  
**Quando** o front-end receber a resposta de erro  
**Então** deverá exibir uma mensagem genérica e não apresentar detalhes técnicos.

### Cenário 7 - Duplo clique no envio

**Dado** que uma redefinição está sendo processada  
**Quando** o usuário tentar acionar o botão novamente  
**Então** nenhuma solicitação duplicada deverá ser enviada.

---

## 18. Dependências com o backend

Antes da implementação, alinhar com o backend:

- URL e método HTTP do endpoint de redefinição;
- formato definitivo do payload;
- nome dos campos do contrato;
- regras mínimas da nova senha;
- códigos HTTP de cada cenário;
- estrutura das mensagens de erro;
- necessidade ou não de um endpoint de validação antecipada do token;
- rota final de login após a redefinição.

---

## 19. Fora do escopo

Não fazem parte deste ajuste de front-end:

- geração do token;
- armazenamento do token;
- associação entre token e usuário;
- definição do prazo de expiração;
- envio do e-mail de recuperação;
- atualização da senha no banco de dados;
- invalidação do token no backend;
- alteração das regras de criptografia ou codificação da senha.

---

## 20. Resultado esperado

Após a implementação, o usuário deverá acessar o link de recuperação e informar somente a nova senha e sua confirmação.

O front-end utilizará o token da URL para realizar a integração com o backend, eliminando a solicitação redundante do e-mail e simplificando o fluxo de recuperação de senha.
