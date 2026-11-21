// Configuração de campos por role.
// Cada campo: { name, label, placeholder, type, options? }
// name deve bater EXATAMENTE com o campo do JSON do backend.

export const porteiroFields = [
  { name: "nomeCompleto", label: "Nome completo", placeholder: "Ex: Carlos Souza", type: "text" },
  { name: "cpf", label: "CPF", placeholder: "00000000000", type: "text", mask: "cpf" },
  { name: "email", label: "E-mail", placeholder: "email@exemplo.com", type: "email" },
  { name: "telefone", label: "Telefone", placeholder: "11999999999", type: "tel", mask: "telefone" },
  { name: "dataNascimento", label: "Data de nascimento", placeholder: "", type: "date" },
  {
    name: "turno",
    label: "Turno",
    placeholder: "Selecione o turno",
    type: "select",
    // Valores enum do backend
    options: [
      { value: "MANHA", label: "Manhã" },
      { value: "TARDE", label: "Tarde" },
      { value: "NOITE", label: "Noite" },
    ],
  },
  { name: "empresaResponsavel", label: "Empresa Responsável", placeholder: "Ex: Seguradora Alfa", type: "text" },
];

export const sindicoFields = [
  { name: "nomeCompleto", label: "Nome completo", placeholder: "Ex: Roberto Oliveira", type: "text" },
  { name: "cpf", label: "CPF", placeholder: "00000000000", type: "text", mask: "cpf" },
  { name: "email", label: "E-mail", placeholder: "email@exemplo.com", type: "email" },
  { name: "telefone", label: "Telefone", placeholder: "11999999999", type: "tel", mask: "telefone" },
  { name: "dataNascimento", label: "Data de nascimento", placeholder: "", type: "date" },
];

export const moradorFields = [
  { name: "nomeCompleto", label: "Nome completo", placeholder: "Ex: Mariana Silva", type: "text" },
  { name: "cpf", label: "CPF", placeholder: "000.000.000-00", type: "text", mask: "cpf" },
  { name: "email", label: "E-mail", placeholder: "email@exemplo.com", type: "email" },
  { name: "telefone", label: "Telefone", placeholder: "(11)99999-9999", type: "tel", mask: "telefone" },
  { name: "dataChegada", label: "Data de chegada", placeholder: "", type: "date" },
  { name: "dataNascimento", label: "Data de nascimento", placeholder: "", type: "date" },
];

export const convidadoFields = [
  { name: "nome", label: "Nome", type: "text", placeholder: "Digite o nome do convidado" },
  { name: "telefone", label: "Telefone", type: "tel", placeholder: "Digite o telefone do convidado" },
  { name: "cpf", label: "CPF", type: "text", placeholder: "000.000.000-00" },
  { name: "recorrencia", label: "Recorrência", type: "select", placeholder: "Selecione a recorrência", options: [
    { value: "LIVRE", label: "Livre" },
    { value: "UNICA", label: "Única" },
    { value: "DIARIA", label: "Diária" },
    { value: "SEMANAL", label: "Semanal" },
    { value: "MENSAL", label: "Mensal" },
  ]}
];


export const visitanteFields = [
  { name: "nome", label: "Nome", type: "text", placeholder: "Digite o nome do visitante" },
  {
    name: "tipoVisita",
    label: "Tipo de Visita",
    placeholder: "Selecione o tipo de visitante",
    type: "select",
    options: [
      { value: "COMUM", label: "Comum" },
      { value: "SERVICO", label: "Serviço" },
    ],
  },
];
