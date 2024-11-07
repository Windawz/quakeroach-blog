import { createContext, useContext, useState } from "react";
import {  TokenPair } from "./apiCall";
import { useCookies } from "react-cookie";

export function useApiState(): ApiState {
  return useContext(apiStateContext);
}

export function ApiStateProvider({ children }: { children?: any }) {
  const cookieName = "quakeroach-blog";

  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

  const tokenPair: TokenPair | undefined = cookies[cookieName];
  const setTokenPair = (value: TokenPair | undefined) => tokenPair !== undefined
    ? setCookie(cookieName, value)
    : removeCookie(cookieName);

  return (
    <apiStateContext.Provider value={{ userName, setUserName, tokenPair, setTokenPair }}>
      {children}
    </apiStateContext.Provider>
  );
}

export type ApiState = {
  userName: string | undefined;
  setUserName: (value: string | undefined) => void;
  tokenPair: TokenPair | undefined;
  setTokenPair: (value: TokenPair | undefined) => void;
};

const apiStateContext = createContext<ApiState>(undefined!);