interface AppErrorParams {
  message?: string;
  inner?: Error;
  userFriendlyMessage?: string;
}

export default abstract class AppError extends Error {
  public readonly userFriendlyMessage?: string;

  protected constructor({ message, inner, userFriendlyMessage }: AppErrorParams) {
    super(message, { cause: inner });
    this.name = this.constructor.name;

    this.userFriendlyMessage = userFriendlyMessage;
  }

  public get inner(): Error | undefined {
    return this.cause as Error | undefined;
  }
}