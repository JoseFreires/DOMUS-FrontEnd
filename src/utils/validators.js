// Uma regra é uma função: (valor, todosOsValores) => mensagem de erro | undefined
// Retornar undefined significa que ta certo

export const required =
  (msg = "Campo obrigatório.") =>
  (v) =>
    String(v).trim() ? undefined : msg;

export const validEmail =
  (msg = "E-mail inválido.") =>
  (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()) ? undefined : msg;

// Compara com outro campo do mesmo formulário (ex: confirmação de senha).
export const matches =
  (otherField, msg = "Os valores não coincidem.") =>
  (v, all) =>
    v === all[otherField] ? undefined : msg;


export const PASSWORD_MIN_LENGTH = 8;

export const strongPassword =
  (msg = `Use ${PASSWORD_MIN_LENGTH}+ caracteres com maiúscula, minúscula e número.`) =>
  (v) => {
    const s = String(v);
    const ok =
      s.length >= PASSWORD_MIN_LENGTH &&
      /[a-z]/.test(s) &&
      /[A-Z]/.test(s) &&
      /\d/.test(s);
    return ok ? undefined : msg;
  };

// Percorre as regras de validação e retorna um objeto { campo: mensagem } com o primeiro erro de cada input

export function validate(values, rules) {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const message = rule(values[field] ?? "", values);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
}
