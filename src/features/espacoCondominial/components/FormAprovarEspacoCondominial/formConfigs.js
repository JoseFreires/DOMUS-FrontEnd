
export const moradorFields = [
  { name: "nome",      label: "Nome completo",         placeholder: "Ex: Mariana Silva",     type: "text"  },
  { name: "cpf",               label: "CPF",                   placeholder: "000.000.000-00",           type: "text"  },
  { name: "email",             label: "E-mail",                placeholder: "email@exemplo.com",     type: "email" },
  { name: "apartamento",         label: "Apartamento",                placeholder: "",     type: "text" },
  { name: "quantidadeConvidados",         label: "Qnt. Convidados",                placeholder: "",     type: "number" },
  { name: "restricoes",         label: "Aceita as restrições?",                placeholder: "",     type: "text" }
  
];


export const reservasFields = [
  { name: "nomeEspaco",             label: "Nome do espaço",         placeholder: "Ex: Mariana Silva",     type: "text"  },
  { name: "capacidadeMaxima",               label: "Capacidade Máx.",                   placeholder: "",           type: "text", inline: true  },
  { name: "valor",             label: "Valor do Espaço",                placeholder: "",     type: "number", inline: true },
  { name: "descricao",          label: "Descrição",              placeholder: "",           type: "textarea"   },
  { name: "restricao",         label: "Restrição",            placeholder: "",               type: "text"  }
  
];