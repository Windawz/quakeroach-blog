import axios, { AxiosError, AxiosResponse } from "axios";
import { envars } from "../envars";
import assert from "assert";
import { TokenPair } from "./TokenPair";
import { ErrorDetails, errorDetailsFromAxiosError } from "./ErrorDetails";

export interface ApiAuthenticateRequest {
  intent: "authenticate";
  userName: string;
  passwordText: string;
}

export interface ApiFetchBodylessRequest {
  intent: "fetch";
  method: "get";
  url: string;
  tokens?: TokenPair;
  params?: any;
}

export interface ApiFetchBodyRequest {
  intent: "fetch";
  method: "post" | "put" | "delete";
  url: string;
  tokens?: TokenPair;
  params?: any;
  data?: any;
}

export interface ApiAuthenticateSuccessResponse {
  intent: "authenticate";
  kind: "success";
  tokens: TokenPair;
}

export interface ApiAuthenticateErrorResponse extends ErrorDetails {
  intent: "authenticate";
  kind: "error";
}

export interface ApiFetchSuccessResponse {
  intent: "fetch";
  kind: "success";
  refreshedTokens?: TokenPair;
  data: any;
}

export interface ApiFetchTokensExpiredResponse {
  intent: "fetch";
  kind: "tokensExpired";
}

export interface ApiFetchErrorResponse extends ErrorDetails {
  intent: "fetch";
  kind: "error";
  refreshedTokens?: TokenPair;
}

export type ApiFetchRequest = ApiFetchBodylessRequest | ApiFetchBodyRequest;
export type ApiAuthenticateResponse = ApiAuthenticateSuccessResponse | ApiAuthenticateErrorResponse;
export type ApiFetchResponse = ApiFetchSuccessResponse | ApiFetchTokensExpiredResponse | ApiFetchErrorResponse;
export type ApiRequest = ApiAuthenticateRequest | ApiFetchRequest;
export type ApiResponse = ApiAuthenticateResponse | ApiFetchResponse;

export async function apiCall(request: ApiAuthenticateRequest): Promise<ApiAuthenticateResponse>;
export async function apiCall(request: ApiFetchRequest): Promise<ApiFetchResponse>;
export async function apiCall(request: ApiRequest): Promise<ApiResponse> {
  switch (request.intent) {
    case "authenticate":
      return await apiCallAuthenticate(request);
    case "fetch":
      return await apiCallFetch(request);
  }
}

async function apiCallAuthenticate(request: ApiAuthenticateRequest): Promise<ApiAuthenticateResponse> {
  const { userName, passwordText } = request;

  const response = await axiosInstance
    .post("/auth/login", {
      userName,
      passwordText,
    })
    .then((r) => {
      const result: ApiAuthenticateSuccessResponse = {
        intent: "authenticate",
        kind: "success",
        tokens: r.data,
      };

      return result;
    })
    .catch((e) => {
      const error = e as AxiosError;
      
      const result: ApiAuthenticateErrorResponse = {
        intent: "authenticate",
        kind: "error",
        ...errorDetailsFromAxiosError(error),
      };

      return result;
    });
  
  return response;
}

async function apiCallFetch(request: ApiFetchRequest): Promise<ApiFetchResponse> {
  async function axiosRequest(tokens: TokenPair | undefined): Promise<AxiosResponse<any, any>> {
    return await axiosInstance.request({
      url: request.url,
      method: request.method,
      params: request.params,
      data: request.method !== "get" ? request.data : undefined,
      headers:
        tokens === undefined
          ? undefined
          : {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
    });
  }

  let axiosResponse: AxiosResponse<any, any> | undefined = undefined;
  let refreshedTokens: TokenPair | undefined = undefined;

  try {
    axiosResponse = await axiosRequest(request.tokens);
  } catch (e) {
    const error = e as AxiosError;

    if (error.status === 401) {
      if (request.tokens === undefined) {
        return {
          intent: "fetch",
          kind: "tokensExpired",
        };
      }
      
      const refreshResult = await apiRefresh(request.tokens.refreshToken);

      switch (refreshResult.kind) {
        case "success":
          refreshedTokens = refreshResult.tokens;
          try {
            axiosResponse = await axiosRequest(refreshedTokens);
          } catch (e) {
            const error = e as AxiosError;

            return {
              intent: "fetch",
              kind: "error",
              refreshedTokens: refreshedTokens,
              ...errorDetailsFromAxiosError(error),
            };
          }
          break;
        case "expired":
          return {
            intent: "fetch",
            kind: "tokensExpired",
          };
        case "error":
          return {
            intent: "fetch",
            kind: "error",
            message: refreshResult.message,
            status: refreshResult.status,
          };
      }
    } else {
      return {
        intent: "fetch",
        kind: "error",
        ...errorDetailsFromAxiosError(error),
      };
    }
  }

  assert(axiosResponse !== undefined);

  return {
    intent: "fetch",
    kind: "success",
    data: axiosResponse.data,
    refreshedTokens,
  };
}

type ApiRefreshResult = ApiRefreshSuccessResult | ApiRefreshExpiredResult | ApiRefreshErrorResult;

interface ApiRefreshSuccessResult {
  kind: "success";
  tokens: TokenPair;
}

interface ApiRefreshExpiredResult {
  kind: "expired";
}

interface ApiRefreshErrorResult extends ErrorDetails {
  kind: "error";
}

async function apiRefresh(refreshToken: string): Promise<ApiRefreshResult> {
  let response: AxiosResponse;
  
  try {
    response = await axiosInstance.post("/auth/refresh", {
      refreshToken,
    });
  } catch (e) {
    const error = e as AxiosError;

    if (error.status === 400) {
      return {
        kind: "expired",
      };
    }

    return {
      kind: "error",
      ...errorDetailsFromAxiosError(error),
    };
  }

  return {
    kind: "success",
    tokens: {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    },
  };
}

const axiosInstance = axios.create({
  baseURL: envars.baseApiUrl,
});