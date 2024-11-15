import { TokenPair } from "./TokenPair";
import { useCookies } from "react-cookie";

export interface ApiStateController {
  apiState?: ApiState;
  setApiState: (value: ApiState | undefined) => void;
}

export interface ApiState {
  userName: string;
  tokens: TokenPair;
};

export function useApiState(): ApiStateController {
  const cookieName = "quakeroach-blog";
  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

  const apiState = cookies[cookieName];
  const setApiState = (value: ApiState | undefined) => value !== undefined
    ? setCookie(cookieName, value)
    : removeCookie(cookieName);
  
  return {
    apiState,
    setApiState,
  };
}