export interface AppErrorParams {
  message?: string;
  cause?: unknown;
  userFriendlyMessage?: string;
}

export class AppError extends Error {
  public constructor({ message, cause, userFriendlyMessage }: AppErrorParams) {
    const finalMessage =
      process.env.NODE_ENV !== "development"
        ? userFriendlyMessage !== undefined
          ? userFriendlyMessage
          : ""
        : message !== undefined && message.trim().length > 0
        ? message
        : cause !== undefined &&
          cause instanceof Error &&
          cause.message !== undefined &&
          cause.message.trim().length > 0
        ? cause.message
        : "";

    super(finalMessage, { cause });
    this.name = this.constructor.name;
  }
}