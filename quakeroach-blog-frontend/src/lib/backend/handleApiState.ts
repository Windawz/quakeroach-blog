import { NavigateFunction } from "react-router-dom";
import { ApiFetchResponse } from "./apiCall";
import { ApiState } from "./apiState";
import assert from "assert";
import { AppError } from "../errorHandling";

export function updateApiStateOrAskForAuthOnExpiredTokens(
  response: ApiFetchResponse,
  navigate: NavigateFunction,
  apiState: ApiState | undefined,
  setApiState: (value: ApiState | undefined) => void,
  onTokensNotExpired: (response: Exclude<ApiFetchResponse, { kind: "tokensExpired" }>) => void,
) {
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

    onTokensNotExpired(response);
  }
}