import { AxiosError } from "axios";

export interface ErrorDetails {
  message: string;
  status: number;
}

export function errorDetailsFromAxiosError(error: AxiosError): ErrorDetails {
  const status = error.status!;

  const response = error.response;

  if (response !== undefined) {
    const data = response.data as any;

    if (data.errorMessage?.trim()) {
      return {
        message: data.errorMessage,
        status,
      };
    }

    const statusText = response.statusText;

    if (statusText?.trim()) {
      return {
        message: statusText,
        status,
      };
    }
  }

  const message = error.message;

  if (message?.trim()) {
    return {
      message,
      status,
    };
  }

  return {
    message: "Unknown error",
    status,
  };
}