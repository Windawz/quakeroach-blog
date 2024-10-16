import AppError from "./AppError";

export default class UndefinedEnvarError extends AppError {
  public constructor(envarName: string) {
    super({
      message: `Envar "${envarName}" not defined`,
      userFriendlyMessage: 'Did someone forget to set the envars???',
    });
  }
}