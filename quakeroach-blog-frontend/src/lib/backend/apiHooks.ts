import { useEffect, useState } from "react";
import { ApiState, useApiState } from "./apiState";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { apiCall, ApiFetchResponse } from "./apiCall";
import { ErrorDetails } from "./ErrorDetails";
import assert from "assert";
import { AppError } from "../errorHandling";
import moment from "moment";

export function useCommand<TResultData, TRoute extends any[], TParams extends {}, TData extends {}>(
  args: UseCommandBodyArgs<TResultData, TRoute, TParams, TData>
): BodyCommandController<TResultData, TRoute, TParams, TData>;

export function useCommand<TResultData, TRoute extends any[], TParams extends {}>(
  args: UseCommandBodylessArgs<TResultData, TRoute, TParams>
): BodylessCommandController<TResultData, TRoute, TParams>;

export function useCommand<TResultData, TRoute extends any[], TParams extends {}, TData extends {}>(
  args: UseCommandArgs<TResultData, TRoute, TParams, TData>
): CommandController<TResultData, TRoute, TParams, TData> {
  const navigate = useNavigate();
  const { apiState, setApiState } = useApiState();
  const [result, setResult] = useState<CommandResult<TResultData>>({ kind: "dormant" });

  const execute = (executeArgs: BodyExecuteArgs<TRoute, TParams, TData> | BodylessExecuteArgs<TRoute, TParams>) => {
    if (result.kind === "pending") {
      return;
    }

    setResult({ kind: "pending" });

    const routeTransform = args.routeTransform ?? (x => x);
    const paramsTransform = args.paramsTransform ?? (x => x);
    const dataTransform = (args as UseCommandBodyArgs<TResultData, TRoute, TParams, TData>).dataTransform ?? (x => x);
    
    const route = routeTransform(executeArgs.route);
    const params = paramsTransform(executeArgs.params);
    const data = dataTransform((executeArgs as BodyExecuteArgs<TRoute, TParams, TData>).data ?? {});

    const url = joinUrl(
      args.url,
      route);
      
    const performCall = async () => {
      const response = await apiCall({
        intent: "fetch",
        method: args.method,
        url,
        params,
        data,
        tokens: apiState?.tokens,
      });

      updateApiStateOrAskForAuthOnExpiredTokens(response, navigate, apiState, setApiState, response => {
        switch (response.kind) {
          case "success":
            const finalData = args.resultDataTransform !== undefined
              ? args.resultDataTransform(response.data)
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

export function useQuery<T>(params: UseQueryArgs<T>): QueryResult<T> {
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

export type UseCommandArgs<TResultData, TRoute, TParams extends {}, TData extends {}> =
  UseCommandBodyArgs<TResultData, TRoute, TParams, TData>
  | UseCommandBodylessArgs<TResultData, TRoute, TParams>;

export interface UseCommandBodyArgs<TResultData, TRoute, TParams extends {}, TData extends {}> extends UseCommandArgsBase<TResultData, TRoute, TParams> {
  method: "post" | "put" | "delete";
  dataTransform?: (data: TData) => object;
}

export interface UseCommandBodylessArgs<TResultData, TRoute, TParams extends {}> extends UseCommandArgsBase<TResultData, TRoute, TParams> {
  method: "get";
}

interface UseCommandArgsBase<TResultData, TRoute, TParams extends {}> extends ApiHookArgsBase<TResultData> {
  routeTransform?: (route: TRoute) => any[];
  paramsTransform?: (params: TParams) => object;
}

export type CommandController<TResultData, TRoute extends any[], TParams extends {}, TData extends {}> = 
  BodyCommandController<TResultData, TRoute, TParams, TData>
  | BodylessCommandController<TResultData, TRoute, TParams>;

export interface BodyCommandController<TResultData, TRoute extends any[], TParams extends {}, TData extends {}> extends CommandControllerBase<TResultData> {
  readonly execute: (args: BodyExecuteArgs<TRoute, TParams, TData>) => void;
}

export interface BodylessCommandController<TResultData, TRoute extends any[], TParams extends {}> extends CommandControllerBase<TResultData> {
  readonly execute: (args: BodylessExecuteArgs<TRoute, TParams>) => void;
}

interface CommandControllerBase<TResultData> {
  result: CommandResult<TResultData>;
}

export type BodyExecuteArgs<TRoute extends any[], TParams extends {}, TData extends {}> = BodylessExecuteArgs<TRoute, TParams> & {
  data: TData;
};

export type BodylessExecuteArgs<TRoute extends any[], TParams extends {}> = {
  route: TRoute;
  params: TParams;
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

export type UseQueryArgs<TResultData> = UseQueryBodylessArgs<TResultData> | UseQueryBodyArgs<TResultData>;

export interface UseQueryBodylessArgs<TResultData> extends UseQueryArgsBase<TResultData> {
  method: "get";
}

export interface UseQueryBodyArgs<TResultData> extends UseQueryArgsBase<TResultData> {
  method: "post" | "put" | "delete";
  data?: any;
}

interface UseQueryArgsBase<TResultData> extends ApiHookArgsBase<TResultData> {
  params?: any;
}

interface ApiHookArgsBase<TResultData> {
  url: string;
  resultDataTransform?: (value: any) => TResultData;
}

function updateApiStateOrAskForAuthOnExpiredTokens(
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

      const tokensReceivedAt = moment.utc();

      setApiState({
        userName: apiState!.userName,
        tokens: response.refreshedTokens,
        tokensReceivedAt,
      });
    }

    onTokensNotExpired(response);
  }
}

function joinUrl(firstPart: string, nextParts: any[]): string {
  const partMapper = (x: any) => 
    (typeof x !== "string"
      ? String(x)
      : x).replaceAll("/", "");

  const mappedParts = nextParts.map(partMapper);
    
  const allParts = [firstPart, ...mappedParts];

  return `${firstPart.startsWith("/") ? "" : "/"}${allParts.join("/")}`;
}