import { useEffect, useState } from "react";
import { useApiState } from "./apiState";
import { useNavigate } from "react-router-dom";
import { apiCall } from "./apiCall";
import assert from "assert";
import { AppError } from "../errorHandling";

export function useQuery<TResponseData>(params: QueryParams<TResponseData>): QueryResult<TResponseData> {
  const navigate = useNavigate();
  const { apiState, setApiState } = useApiState();
  const [result, setResult] = useState<QueryResult<TResponseData>>({ kind: "pending" });

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
            const finalData = params.responseDataSelector !== undefined
              ? params.responseDataSelector(response.data)
              : response.data;

            setResult({
              kind: "success",
              headers: response.headers,
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
      }
    };

    performCall();

    return () => {
      active = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return result;
}

export type QueryResult<TResponseData> = QuerySuccessResult<TResponseData> | QueryPendingResult | QueryErrorResult;

export interface QuerySuccessResult<TResponseData> {
  kind: "success";
  headers: QuerySuccessResultHeaders;
  data: TResponseData;
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

export type QueryParams<TResponseData> = GetQueryParams<TResponseData> | PostQueryParams<TResponseData>;

export interface GetQueryParams<TResponseData> extends BaseQueryParams<TResponseData> {
  method: "get";
}

export interface PostQueryParams<TResponseData> extends BaseQueryParams<TResponseData> {
  method: "post";
  data?: any;
}

export interface BaseQueryParams<TResponseData> {
  url: string;
  params?: any;
  responseDataSelector?: (value: any) => TResponseData;
}
