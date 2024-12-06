import { useEffect, useState } from "react";
import { useApiState } from "./apiState";
import { apiCall } from "./apiCall";
import { ErrorDetails } from "./ErrorDetails";
import moment from "moment";

export function useAuth(): AuthController {
  const { apiState, setApiState } = useApiState();

  const [inputUserName, setInputUserName] = useState<string>("");
  const [inputPasswordText, setInputPasswordText] = useState<string>("");

  useEffect(() => {
    const now = moment.utc();

    if (apiState !== undefined) {
      const expirationTime = apiState.tokensReceivedAt.clone();

      expirationTime.add(apiState.tokens.timeUntilRefreshTokenExpiration);

      if (now.isAfter(expirationTime)) {
        setApiState(undefined);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiState]);

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
        const tokensReceivedAt = moment.utc();
        setApiState({
          userName: inputUserName,
          tokens: response.tokens,
          tokensReceivedAt,
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

export interface ErrorAuthSubmitResult extends ErrorDetails {
  kind: "error";
}