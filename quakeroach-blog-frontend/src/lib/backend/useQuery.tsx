import { useEffect, useState } from "react";
import { useApiState } from "./apiState";
import { useNavigate } from "react-router-dom";
import { apiCall } from "./apiCall";
import assert from "assert";
import { AppError } from "../errorHandling";

export function useQuery(params: QueryParams): QueryResult {
  const navigate = useNavigate();
  const { apiState, setApiState } = useApiState();
  const [result, setResult] = useState<QueryResult>({ kind: "pending" });

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

      if (response.kind === "tokensExpired") {
        navigate("/auth");
      } else {
        if (response.refreshedTokens !== undefined) {
          assert(apiState !== undefined, new AppError({
            message: "Cannot refresh tokens mid-query because api state is undefined",
          }));

          setApiState({
            userName: apiState!.userName,
            tokens: response.refreshedTokens,
          });
        }

        switch (response.kind) {
          case "success":
            setResult({
              kind: "success",
              headers: response.headers,
              data: response.data,
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
      }
    };

    performCall();

    return () => {
      active = false;
    };
  }, [
    params.method,
    params.url,
    params.params,
    data,
    navigate,
    apiState,
    setApiState,
  ]);

  return result;
}

export type QueryResult = QuerySuccessResult | QueryPendingResult | QueryErrorResult;

export interface QuerySuccessResult {
  kind: "success";
  headers: QuerySuccessResultHeaders;
  data?: any;
}

export interface QueryPendingResult {
  kind: "pending";
}

export interface QueryErrorResult {
  kind: "error";
  message: string;
  status: number;
}

export interface QuerySuccessResultHeaders {
  location?: string;
}

export type QueryParams = GetQueryParams | PostQueryParams;

export interface GetQueryParams extends CommonQueryParams {
  method: "get";
}

export interface PostQueryParams extends CommonQueryParams {
  method: "post";
  data?: any;
}

interface CommonQueryParams {
  url: string;
  params?: any;
}
