import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { envars } from "../envars";
import assert from "assert";
import { TokenPair } from "./TokenPair";
import { ErrorDetails } from "./ErrorDetails";
import { isPlainObject } from "../isPlainObject";
import { isMoment } from "moment";
import moment from "moment";

export type ApiRequest = ApiAuthenticateRequest | ApiFetchRequest;

export interface ApiAuthenticateRequest {
  intent: "authenticate";
  userName: string;
  passwordText: string;
}

export type ApiFetchRequest = ApiFetchBodyRequest | ApiFetchBodylessRequest;

export interface ApiFetchBodyRequest extends ApiFetchRequestBase {
  method: "post" | "put" | "delete";
  data?: any;
}

export interface ApiFetchBodylessRequest extends ApiFetchRequestBase {
  method: "get",
}

interface ApiFetchRequestBase {
  intent: "fetch";
  url: string;
  tokens?: TokenPair;
  params?: any;
}

export type ApiResponse = ApiAuthenticateResponse | ApiFetchResponse;

export type ApiAuthenticateResponse = ApiAuthenticateSuccessResponse | ApiAuthenticateErrorResponse;

export interface ApiAuthenticateSuccessResponse extends ApiAuthenticateResponseBase {
  kind: "success";
  tokens: TokenPair;
}

export interface ApiAuthenticateErrorResponse extends ApiAuthenticateResponseBase, ErrorDetails {
  kind: "error";
}

interface ApiAuthenticateResponseBase {
  intent: "authenticate";
}

export type ApiFetchResponse = ApiFetchSuccessResponse | ApiFetchTokensExpiredResponse | ApiFetchErrorResponse;

export interface ApiFetchSuccessResponse extends ApiFetchTokensResponseBase {
  kind: "success";
  location?: string;
  data?: any;
}

export interface ApiFetchTokensExpiredResponse extends ApiFetchResponseBase {
  kind: "tokensExpired";
}

export interface ApiFetchErrorResponse extends ApiFetchTokensResponseBase, ErrorDetails {
  kind: "error";
}

interface ApiFetchTokensResponseBase extends ApiFetchResponseBase {
  refreshedTokens?: TokenPair;
}

interface ApiFetchResponseBase {
  intent: "fetch";
}

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

  const response = await ApiAxiosInstance.get
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
    return await ApiAxiosInstance.get.request({
      url: request.url,
      method: request.method,
      params: mapRequestInput(request.params),
      data: request.method !== "get" ? mapRequestInput(request.data) : undefined,
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
    location: getLocation(axiosResponse),
    data: mapResponseOutput(axiosResponse.data),
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
    response = await ApiAxiosInstance.get.post("/auth/refresh", {
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

class ApiAxiosInstance {
  private static lazyInstance: AxiosInstance | undefined = undefined;

  private constructor() {}

  public static get get(): AxiosInstance {
    if (this.lazyInstance === undefined) {
      this.lazyInstance = axios.create({
        baseURL: envars.baseApiUrl,
      });
    }
    
    return this.lazyInstance;
  }
}

function getLocation(response: AxiosResponse): string | undefined {
  const location = response.headers["Location"];

  if (location && typeof location === "string" && location.trim()) {
    return location;
  }

  return undefined;
}

function errorDetailsFromAxiosError(error: AxiosError): ErrorDetails {
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

function mapRequestInput(input: any | undefined): any | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (isMoment(input)) {
    return input.format();
  }

  if (Array.isArray(input)) {
    return input.map(x => mapRequestInput(x));
  }

  if (isPlainObject(input)) {
    return Object.fromEntries(
      Object.entries(input).map(([k, v]) => [k, mapRequestInput(v)]),
    );
  }

  return input;
}

function mapResponseOutput(output: any | undefined): any | undefined {
  if (output === undefined) {
    return undefined;
  }

  if (typeof output === "string") {
    const date = moment(output);
    if (date.isValid()) {
      return date;
    }
  }

  if (Array.isArray(output)) {
    return output.map(x => mapResponseOutput(x));
  }

  if (isPlainObject(output)) {
    return Object.fromEntries(
      Object.entries(output).map(([k, v]) => [k, mapResponseOutput(v)]),
    );
  }

  return output;
}