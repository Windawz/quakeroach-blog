import { useEffect, useState } from "react";
import { useApiState } from "./apiState";
import { useNavigate } from "react-router-dom";
import { apiCall } from "./apiCall";
import { updateApiStateOrAskForAuthOnExpiredTokens } from "./handleApiState";
import { ErrorDetails } from "./ErrorDetails";

export function useCommand<T>(params: UseCommandBodyParams<T>): BodyCommandController<T>;
export function useCommand<T>(params: UseCommandBodylessParams<T>): BodylessCommandController<T>;
export function useCommand<T>(params: UseCommandParams<T>): CommandController<T> {
  const navigate = useNavigate();
  const { apiState, setApiState } = useApiState();
  const [result, setResult] = useState<CommandResult<T>>({ kind: "dormant" });

  const execute = (executeParams: BodyExecuteParams | BodylessExecuteParams) => {
    if (result.kind === "pending") {
      return;
    }

    setResult({ kind: "pending" });

    const data: any | undefined = (executeParams as BodyExecuteParams).data;

    const performCall = async () => {
      const response = await apiCall({
        intent: "fetch",
        method: params.method,
        url: params.url,
        params: executeParams.params,
        data,
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

export type UseCommandParams<T> = UseCommandBodyParams<T> | UseCommandBodylessParams<T>;

export interface UseCommandBodyParams<T> extends UseCommandParamsBase<T> {
  method: "post" | "put" | "delete";
}

export interface UseCommandBodylessParams<T> extends UseCommandParamsBase<T> {
  method: "get";
}

interface UseCommandParamsBase<T> extends ApiHookParamsBase<T> {}

export type CommandController<T> = BodyCommandController<T> | BodylessCommandController<T>;

export interface BodyCommandController<T> extends CommandControllerBase<T> {
  readonly execute: (params: BodyExecuteParams) => void;
}

export interface BodylessCommandController<T> extends CommandControllerBase<T> {
  readonly execute: (params: BodylessExecuteParams) => void;
}

interface CommandControllerBase<T> {
  result: CommandResult<T>;
}

export interface BodyExecuteParams extends BodylessExecuteParams {
  data?: any;
}

export interface BodylessExecuteParams {
  params?: any;
}

export type CommandResult<T> = ApiHookSuccessResult<T> | ApiHookDormantResult | ApiHookPendingResult | ApiHookErrorResult;

export type QueryResult<T> = ApiHookSuccessResult<T> | ApiHookPendingResult | ApiHookErrorResult;

export interface ApiHookSuccessResult<T> {
  kind: "success";
  location?: string;
  data: T;
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

export type UseQueryParams<T> = UseQueryBodylessParams<T> | UseQueryBodyParams<T>;

export interface UseQueryBodylessParams<T> extends UseQueryParamsBase<T> {
  method: "get";
}

export interface UseQueryBodyParams<T> extends UseQueryParamsBase<T> {
  method: "post" | "put" | "delete";
  data?: any;
}

interface UseQueryParamsBase<T> extends ApiHookParamsBase<T> {
  params?: any;
}

interface ApiHookParamsBase<T> {
  url: string;
  resultDataTransform?: (value: any) => T;
}