import { AxiosError } from "axios";
import AppError from "./AppError";

interface BackendErrorParams {
  endpoint: string;
  message?: string;
  inner?: AxiosError;
}

export class BackendError extends AppError {
  public readonly endpoint: string;

  public constructor({endpoint, message, inner} : BackendErrorParams) {
    super({ message: `"${endpoint}"${message !== undefined ? (': ' + message) : ''}`, inner });

    this.endpoint = endpoint;
  }
}