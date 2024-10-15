export const ENVARS = {
  get baseApiUrl(): string {
    const result = process.env.REACT_APP_BASE_API_URL;
    if (result === undefined) {
      throw new UndefinedEnvarError("REACT_APP_BASE_API_URL");
    }

    return result!;
  }
};

export class UndefinedEnvarError extends Error {
  constructor(envarName: string) {
    super(`Envar "${envarName}" not defined`);
  }
}