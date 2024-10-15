export default abstract class AppError extends Error {
  protected constructor(message?: string, inner?: Error) {
    super(message, { cause: inner });
    this.name = this.constructor.name;
  }

  public get inner(): Error | undefined {
    return this.cause as Error | undefined;
  }
}