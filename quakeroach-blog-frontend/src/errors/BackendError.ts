import AppError from "./AppError";

export class BackendError extends AppError {
  public readonly endpoint: string;

  public constructor(endpoint: string, message?: string) {
    super({ message });

    this.endpoint = endpoint;
  }
}