import { useEffect, useState } from "react";
import { useApiState } from "./apiState";
import { useNavigate } from "react-router-dom";
import { apiCall } from "./apiCall";
import { updateApiStateOrAskForAuthOnExpiredTokens } from "./handleApiState";
import { ErrorDetails } from "./ErrorDetails";

export function useQuery<T>(params: ApiHookParams<T>): ApiHookResult<T> {
  const navigate = useNavigate();
  const { apiState, setApiState } = useApiState();
  const [result, setResult] = useState<ApiHookResult<T>>({ kind: "pending" });

  const data = params.method === "post" ? params.data : undefined;

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

export type ApiHookResult<T> = ApiHookSuccessResult<T> | ApiHookPendingResult | ApiHookErrorResult;

export interface ApiHookSuccessResult<T> {
  kind: "success";
  data: T;
}

export interface ApiHookPendingResult {
  kind: "pending";
}

export interface ApiHookErrorResult extends ErrorDetails {
  kind: "error";
}

export type ApiHookParams<T> = ApiHookBodylessParams<T> | ApiHookBodyParams<T>;

export interface ApiHookBodylessParams<T> extends ApiHookParamsBase<T> {
  method: "get";
}

export interface ApiHookBodyParams<T> extends ApiHookParamsBase<T> {
  method: "post" | "put" | "delete";
  data?: any;
}

interface ApiHookParamsBase<T> {
  url: string;
  params?: any;
  resultDataTransform?: (value: any) => T;
}
