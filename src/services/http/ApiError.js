// services/http/ApiError.js
export class ApiError extends Error {
  constructor(message, { status = 0, code = null, fieldErrors = null, cause = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;               // ex.: "NETWORK", "TIMEOUT", "HTTP"
    this.fieldErrors = fieldErrors; // { campo: "mensagem" }
    this.cause = cause;
  }

  get isNetwork()    { return this.code === "NETWORK"; }
  get isTimeout()    { return this.code === "TIMEOUT"; }
  get isAuth()       { return this.status === 401; }
  get isForbidden()  { return this.status === 403; }
  get isValidation() { return this.status === 400 || this.status === 422; }
  get isServer()     { return this.status >= 500; }
}