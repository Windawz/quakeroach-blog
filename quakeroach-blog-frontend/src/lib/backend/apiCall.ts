import axios, { AxiosError, AxiosResponse } from "axios";
import { envars } from "../envars";
import assert from "assert";

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export interface ApiAuthenticateRequest {
  intent: "authenticate";
  userName: string;
  passwordText: string;
}

export interface ApiFetchGetRequest {
  intent: "fetch";
  method: "get";
  url: string;
  tokens?: TokenPair;
  params?: any;
}

export interface ApiFetchPostRequest {
  intent: "fetch";
  method: "post";
  url: string;
  tokens: TokenPair;
  params?: any;
  data?: any;
}

export interface ApiAuthenticateSuccessResponse {
  intent: "authenticate";
  kind: "success";
  tokens: TokenPair;
}

export interface ApiAuthenticateErrorResponse {
  intent: "authenticate";
  kind: "error";
  status: number;
  message: string;
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

export interface ApiFetchErrorResponse {
  intent: "fetch";
  kind: "error";
  refreshedTokens?: TokenPair;
  status: number;
  message: string;
}

export type ApiFetchRequest = ApiFetchGetRequest | ApiFetchPostRequest;
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
    .post("auth/login", {
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
        message: (error.response!.data as any).errorMessage,
        status: error.status!,
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
      data: request.method === "post" ? request.data : undefined,
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
              message: (error.response!.data as any).errorMessage,
              status: error.status!,
              refreshedTokens: refreshedTokens,
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
        message: (error.response!.data as any).errorMessage,
        status: error.status!,
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

type ApiRefreshResult = {
  kind: "success";
  tokens: TokenPair;
} | {
  kind: "expired";
} | {
  kind: "error";
  message: string;
  status: number;
};

async function apiRefresh(refreshToken: string): Promise<ApiRefreshResult> {
  return await axiosInstance.post("auth/refresh", {
    refreshToken,
  }).then()
}

const axiosInstance = axios.create({
  baseURL: envars.baseApiUrl,
});