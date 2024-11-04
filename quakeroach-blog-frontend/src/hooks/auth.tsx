import { createContext, useContext, useReducer } from "react";

export type Auth = {
  isAuthenticated: false;
} | {
  isAuthenticated: true;
  userName: string;
}

export type AuthAction = {
  kind: "authenticate";
  userName: string;
} | {
  kind: "unauthenticate";
}

export function AuthProvider({ children }: { children?: any }) {
  const initialState: Auth = {
    isAuthenticated: false,
  };

  const [auth, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth(): Auth {
  return useContext(AuthContext);
}

export function useAuthDispatch(): React.Dispatch<AuthAction> {
  return useContext(AuthDispatchContext);
}

const AuthContext = createContext<Auth>(undefined!);

const AuthDispatchContext = createContext<React.Dispatch<AuthAction>>(undefined!);

function AuthReducer(auth: Auth, action: AuthAction): Auth {
  switch (action.kind) {
    case "authenticate":
      return {
        isAuthenticated: true,
        userName: action.userName,
      };
    case "unauthenticate":
      return {
        isAuthenticated: false,
      };
  };
};