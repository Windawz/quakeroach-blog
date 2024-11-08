import { useState } from "react";
import { useApiState } from "./apiState";
import { apiCall } from "./apiCall";

export function useAuth(): AuthController {
  const { apiState, setApiState } = useApiState();

  const [inputUserName, setInputUserName] = useState<string>("");
  const [inputPasswordText, setInputPasswordText] = useState<string>("");

  const isAuthenticated = (): boolean => {
    return apiState !== undefined;
  }

  const submitInput = async (): Promise<AuthSubmitResult> => {
    if (isAuthenticated()) {
      return {
        kind: "alreadyAuthenticated",
      };
    }

    const response = await apiCall({
      intent: "authenticate",
      userName: inputUserName,
      passwordText: inputPasswordText,
    });

    switch (response.kind) {
      case "success":
        setApiState({
          userName: inputUserName,
          tokens: response.tokens,
        });
        return {
          kind: "success",
        };
      case "error":
        return {
          kind: "error",
          message: response.message,
          status: response.status,
        };
    }
  }

  const getAuthInfo = (): AuthInfo => {
    return isAuthenticated()
      ? {
        isAuthenticated: true,
        userName: apiState!.userName,
      }
      : {
        isAuthenticated: false,
      };
  }

  return {
    inputUserName,
    setInputUserName,
    inputPasswordText,
    setInputPasswordText,
    submitInput,
    getAuthInfo,
  };
}

export interface AuthController {
  inputUserName: string;
  setInputUserName: (value: string) => void;
  inputPasswordText: string;
  setInputPasswordText: (value: string) => void;
  submitInput: () => Promise<AuthSubmitResult>;
  getAuthInfo: () => AuthInfo;
}

export type AuthInfo = AuthenticatedAuthInfo | UnauthenticatedAuthInfo;

export interface AuthenticatedAuthInfo {
  isAuthenticated: true;
  userName: string;
}

export interface UnauthenticatedAuthInfo {
  isAuthenticated: false;
}

export type AuthSubmitResult = SuccessAuthSubmitResult | AlreadyAuthenticatedAuthSubmitResult | ErrorAuthSubmitResult;

export interface SuccessAuthSubmitResult {
  kind: "success";
}

export interface AlreadyAuthenticatedAuthSubmitResult {
  kind: "alreadyAuthenticated";
}

export interface ErrorAuthSubmitResult {
  kind: "error";
  message: string;
  status: number;
}