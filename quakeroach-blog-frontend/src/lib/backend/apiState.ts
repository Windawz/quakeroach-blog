import { Moment } from "moment";
import { TokenPair } from "./TokenPair";
import { useCookies } from "react-cookie";
import moment from "moment";

export interface ApiStateController {
  apiState?: ApiState;
  setApiState: (value: ApiState | undefined) => void;
}

export interface ApiState {
  userName: string;
  tokensReceivedAt: Moment;
  tokens: TokenPair;
};

export function useApiState(): ApiStateController {
  const cookieName = "quakeroach-blog";
  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

  const cookie = cookies[cookieName];

  const apiState: ApiState | undefined = cookie === undefined
    ? undefined
    : {
      userName: cookie.userName,
      tokens: cookie.tokens,
      tokensReceivedAt: moment(cookie.tokensReceivedAt),
    };
  
  const setApiState = (value: ApiState | undefined) => value !== undefined
    ? setCookie(cookieName, value)
    : removeCookie(cookieName);
  
  return {
    apiState,
    setApiState,
  };
}