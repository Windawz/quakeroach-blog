import { useEffect, useState } from "react";
import { ApiState, useApiState } from "./apiState";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiCall, ApiFetchResponse } from "./apiCall";
import { ErrorDetails } from "./ErrorDetails";
import assert from "assert";
import { AppError } from "../errorHandling";
import moment from "moment";

export function useCommand<TResultData, TExecuteParams, TExecuteData>(
  params: UseCommandBodyParams<TResultData, TExecuteParams, TExecuteData>
): BodyCommandController<TResultData, TExecuteParams, TExecuteData>;

export function useCommand<TResultData, TExecuteParams>(
  params: UseCommandBodylessParams<TResultData, TExecuteParams>
): BodylessCommandController<TResultData, TExecuteParams>;

export function useCommand<TResultData, TExecuteParams, TExecuteData>(
  params: UseCommandParams<TResultData, TExecuteParams, TExecuteData>
): CommandController<TResultData, TExecuteParams, TExecuteData> {
  const navigate = useNavigate();
  const { apiState, setApiState } = useApiState();
  const [result, setResult] = useState<CommandResult<TResultData>>({ kind: "dormant" });

  const execute = (executeParams: BodyExecuteParams<TExecuteParams, TExecuteData> | BodylessExecuteParams<TExecuteParams>) => {
    if (result.kind === "pending") {
      return;
    }

    setResult({ kind: "pending" });

    const data: TExecuteData | undefined = (executeParams as BodyExecuteParams<TExecuteParams, TExecuteData>).data;

    const executeParamsTransform = params.executeParamsTransform;
    const executeDataTransform = (params as UseCommandBodyParams<TResultData, TExecuteParams, TExecuteData>).executeDataTransform;

    const performCall = async () => {
      const response = await apiCall({
        intent: "fetch",
        method: params.method,
        url: params.url,
        params: executeParamsTransform !== undefined && executeParams.params !== undefined
          ? executeParamsTransform(executeParams.params)
          : executeParams.params,
        data: executeDataTransform !== undefined && data !== undefined
          ? executeDataTransform(data)
          : data,
        tokens: apiState?.tokens,
      });

      updateApiStateOrAskForAuthOnExpiredTokens(response, navigate, apiState, setApiState, response => {
        switch (response.kind) {
          case "success":
            const finalData = params.resultDataTransform !== undefined
              ? params.resultDataTransform(response.data)
              : response.data;

            setResult({
              kind: "success",
              location: response.location,
              data: finalData,
            });
            break;
          case "error":
            setResult({
              kind: "error",
              message: response.message,
              status: response.status,
            });
            break;
        }
      });
    };

    performCall();
  };

  return {
    result,
    execute,
  };
}

export function useQuery<T>(params: UseQueryParams<T>): QueryResult<T> {
  const navigate = useNavigate();
  const { apiState, setApiState } = useApiState();
  const [result, setResult] = useState<QueryResult<T>>({ kind: "pending" });

  const data = params.method !== "get" ? params.data : undefined;

  useEffect(() => {
    let active = true;

    const performCall = async () => {
      const response = await apiCall({
        intent: "fetch",
        method: params.method,
        url: params.url,
        params: params.params,
        data: data,
        tokens: apiState?.tokens,
      });

      if (!active) {
        return;
      }

      updateApiStateOrAskForAuthOnExpiredTokens(response, navigate, apiState, setApiState, response => {
        switch (response.kind) {
          case "success":
            const finalData = params.resultDataTransform !== undefined
              ? params.resultDataTransform(response.data)
              : response.data;

            setResult({
              kind: "success",
              location: response.location,
              data: finalData,
            });
            break;
          case "error":
            setResult({
              kind: "error",
              message: response.message,
              status: response.status,
            });
            break;
        }
      });
    };

    performCall();

    return () => {
      active = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return result;
}

export type UseCommandParams<TResultData, TExecuteParams, TExecuteData> =
  UseCommandBodyParams<TResultData, TExecuteParams, TExecuteData>
  | UseCommandBodylessParams<TResultData, TExecuteParams>;

export interface UseCommandBodyParams<TResultData, TExecuteParams, TExecuteData> extends UseCommandParamsBase<TResultData, TExecuteParams> {
  method: "post" | "put" | "delete";
  executeDataTransform?: (data: TExecuteData) => any;
}

export interface UseCommandBodylessParams<TResultData, TExecuteParams> extends UseCommandParamsBase<TResultData, TExecuteParams> {
  method: "get";
}

interface UseCommandParamsBase<TResultData, TExecuteParams> extends ApiHookParamsBase<TResultData> {
  executeParamsTransform?: (params: TExecuteParams) => any;
}

export type CommandController<TResultData, TExecuteParams, TExecuteData> = 
  BodyCommandController<TResultData, TExecuteParams, TExecuteData>
  | BodylessCommandController<TResultData, TExecuteParams>;

export interface BodyCommandController<TResultData, TExecuteParams, TExecuteData> extends CommandControllerBase<TResultData> {
  readonly execute: (params: BodyExecuteParams<TExecuteParams, TExecuteData>) => void;
}

export interface BodylessCommandController<TResultData, TExecuteParams> extends CommandControllerBase<TResultData> {
  readonly execute: (params: BodylessExecuteParams<TExecuteParams>) => void;
}

interface CommandControllerBase<TResultData> {
  result: CommandResult<TResultData>;
}

export type BodyExecuteParams<TExecuteParams, TExecuteData> = BodylessExecuteParams<TExecuteParams> & (TExecuteData extends undefined
  ? {
    data?: undefined;
  }
  : {
    data: TExecuteData;
  });

export type BodylessExecuteParams<TExecuteParams> = TExecuteParams extends undefined
  ? {
    params?: undefined;
  }
  : {
    params: TExecuteParams;
  };

export type CommandResult<TResultData> = ApiHookSuccessResult<TResultData> | ApiHookDormantResult | ApiHookPendingResult | ApiHookErrorResult;

export type QueryResult<TResultData> = ApiHookSuccessResult<TResultData> | ApiHookPendingResult | ApiHookErrorResult;

export interface ApiHookSuccessResult<TResultData> {
  kind: "success";
  location?: string;
  data: TResultData;
}

export interface ApiHookDormantResult {
  kind: "dormant";
}

export interface ApiHookPendingResult {
  kind: "pending";
}

export interface ApiHookErrorResult extends ErrorDetails {
  kind: "error";
}

export type UseQueryParams<TResultData> = UseQueryBodylessParams<TResultData> | UseQueryBodyParams<TResultData>;

export interface UseQueryBodylessParams<TResultData> extends UseQueryParamsBase<TResultData> {
  method: "get";
}

export interface UseQueryBodyParams<TResultData> extends UseQueryParamsBase<TResultData> {
  method: "post" | "put" | "delete";
  data?: any;
}

interface UseQueryParamsBase<TResultData> extends ApiHookParamsBase<TResultData> {
  params?: any;
}

interface ApiHookParamsBase<TResultData> {
  url: string;
  resultDataTransform?: (value: any) => TResultData;
}

export function updateApiStateOrAskForAuthOnExpiredTokens(
  response: ApiFetchResponse,
  navigate: NavigateFunction,
  apiState: ApiState | undefined,
  setApiState: (value: ApiState | undefined) => void,
  onTokensNotExpired: (response: Exclude<ApiFetchResponse, { kind: "tokensExpired" }>) => void,
) {
  if (response.kind === "tokensExpired") {
    setApiState(undefined);
    navigate("/auth");
  } else {
    if (response.refreshedTokens !== undefined) {
      assert(apiState !== undefined, new AppError({
        message: "Cannot refresh tokens mid-query because api state is undefined",
      }));

      const tokensReceivedAt = moment();

      setApiState({
        userName: apiState!.userName,
        tokens: response.refreshedTokens,
        tokensReceivedAt,
      });
    }

    onTokensNotExpired(response);
  }
}