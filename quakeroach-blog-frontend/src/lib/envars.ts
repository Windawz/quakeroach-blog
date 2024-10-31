import { AppError } from "./errorHandling";

export const envars = {
  get baseApiUrl() : string {
    return getRequiredEnvar('REACT_APP_BASE_API_URL');
  }
};

function getRequiredEnvar(name: string): string {
  const value = process.env[name];

  if (value === undefined) {
    throw new AppError({
      message: `Required envar "${value}" is undefined`,
    });
  }

  return value;
}