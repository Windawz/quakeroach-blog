import axios, { AxiosError, AxiosInstance } from "axios";
import { Moment } from "moment";
import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { AppError } from "../lib/errorHandling";
import assert from "assert";

export interface Api {
  get auth(): {
    isAuthenticated: false;
  } | {
    isAuthenticated: true;
    userName: string;
  };

  getBlogPost(input: GetBlogPostInput): Promise<GetBlogPostOutput>;
  getBlogPosts(input: GetBlogPostsInput): Promise<GetBlogPostsOutput>;
  createBlogPost(input: CreateBlogPostInput): Promise<CreateBlogPostOutput>;
  login(input: LoginInput): Promise<LoginOutput>;
  register(input: RegisterInput): Promise<RegisterOutput>;
}

export type Auth = {
  isAuthenticated: false;
} | {
  isAuthenticated: true;
  userName: string;
}

export interface ApiProviderProps {
  baseApiUrl: string;
  children?: any;
}

export function ApiProvider({
  baseApiUrl,
  children,
}: ApiProviderProps) {
  const [apiState, setApiState] = useState<ApiState>(createApiState(baseApiUrl));

  return (
    <apiContext.Provider value={[apiState, setApiState]}>
      {children}
    </apiContext.Provider>
  );
}

export function useApi(): Api {
  const [apiState, setApiState] = useContext(apiContext);
  const [cookies, setCookie, removeCookie] = useCookies(['quakeroach-blog-tokens']);

  return new ApiImpl({
    getApiState: () => apiState,
    setApiState: setApiState,
    getApiCookie: () => cookies['quakeroach-blog-tokens'],
    setApiCookie: value => value === undefined
      ? removeCookie('quakeroach-blog-tokens')
      : setCookie('quakeroach-blog-tokens', value),
  });
}

export type GetBlogPostInput = {
  id: number;
};

export type GetBlogPostOutput = {
  title: string;
  authorName: string;
  content: string;
} | undefined;

export type GetBlogPostsInput = {
  maxCount: number;
  minPublishDate: Moment;
};

export type GetBlogPostsOutput = {
  id: number;
  title: string;
  authorName: string;
  content: string;
}[];

export type CreateBlogPostInput = {
  title: string;
  content: string;
};

export type CreateBlogPostOutput = {
  id: number;
};

export type LoginInput = {
  userName: string;
  passwordText: string;
};

export type LoginOutput = {
  isSuccessful: true,
} | {
  isSuccessful: false,
  reason: string;
};

export type RegisterInput = {
  userName: string;
  passwordText: string;
};

export type RegisterOutput = {
  isSuccessful: true;
} | {
  isSuccessful: false;
  reason: string;
};

type ApiState = {
  axiosInstance: AxiosInstance;
} & ({
  isAuthenticated: true;
  userName: string;
} | {
  isAuthenticated: false;
});

type ApiCookie = {
  accessToken: string;
  refreshToken: string;
};

type ApiHooks = {
  getApiState: () => ApiState;
  setApiState: (value: ApiState) => void;
  getApiCookie: () => ApiCookie | undefined;
  setApiCookie: (value: ApiCookie | undefined) => void;
}

const apiContext = createContext<[ApiState, (value: ApiState) => void]>(undefined!);

function createApiState(baseApiUrl: string): ApiState {
  return {
    axiosInstance: axios.create({
      baseURL: baseApiUrl,
    }),
    isAuthenticated: false,
  };
}

class ApiImpl implements Api {
  private readonly hooks: ApiHooks;

  public constructor(hooks: ApiHooks) {
    this.hooks = hooks;
  }

  public get auth(): Auth {
    return this.hooks.getApiState();
  }

  public getBlogPost({ id }: GetBlogPostInput): Promise<GetBlogPostOutput> {
    return this.hooks.getApiState().axiosInstance.get(`blogPosts/${id}`)
      .then(r => {
        return r.data;
      })
      .catch(e => {
        const error = e as AxiosError;

        if (error.response?.status === 404) {
          return undefined;
        }

        throw error;
      });
  }

  public getBlogPosts({ maxCount, minPublishDate }: GetBlogPostsInput): Promise<GetBlogPostsOutput> {
    return this.hooks.getApiState().axiosInstance.get("blogPosts", {
      params: {
        maxCount,
        minPublishDate: minPublishDate.format(),
      },
    }).then(r => {
      return r.data;
    });
  }

  public createBlogPost({ title, content }: CreateBlogPostInput): Promise<CreateBlogPostOutput> {
    assert(this.hooks.getApiState().isAuthenticated, new AppError({
      message: "Cannot create blog post if unauthenticated",
    }));

    const { accessToken } = this.hooks.getApiCookie()!;

    return this.hooks.getApiState().axiosInstance.post("blogPosts", {
      title,
      content,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(r => {
      const location = r.headers["Location"] as string;
      const id = Number.parseInt(location.substring(location.lastIndexOf("/")));

      return {
        id,
      }
    }).catch(e => {
      const error = e as AxiosError;

      if (error.status === 401) {
        return this.refresh().then(r => this.createBlogPost({ title, content }));
      }

      throw e;
    });
  }

  public login({ userName, passwordText }: LoginInput): Promise<LoginOutput> {
    return this.hooks.getApiState().axiosInstance.post("auth/login", {
      userName,
      passwordText,
    }).then(r => {
      const tokens: {
        accessToken: string;
        refreshToken: string;
      } = r.data;

      this.becomeAuthenticated(userName, tokens);

      return {
        isSuccessful: true,
      } as const;
    }).catch(e => {
      this.becomeUnauthenticated();
      
      const error = e as AxiosError;

      return {
        isSuccessful: false,
        reason: (error.response?.data as any).errorMessage ?? "Unknown error",
      };
    });
  }

  public register({ userName, passwordText }: RegisterInput): Promise<RegisterOutput> {
    assert(this.hooks.getApiState().isAuthenticated, new AppError({
      message: "Cannot register if unauthenticated",
    }));

    const { accessToken } = this.hooks.getApiCookie()!;

    return this.hooks.getApiState().axiosInstance.post("auth/register", {
      userName,
      passwordText,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }).then(r => {
      return {
        isSuccessful: true,
      } as const;
    }).catch(e => {
      const error = e as AxiosError;

      if (error.status === 401) {
        return this.refresh().then(r => this.register({ userName, passwordText }));
      };

      throw e;
    }).catch(e => {
      const error = e as AxiosError;

      return {
        isSuccessful: false,
        reason: (error.response?.data as any).errorMessage ?? "Unknown error",
      };
    });
  }

  private refresh(): Promise<void> {
    const state = this.hooks.getApiState();

    assert(state.isAuthenticated, new AppError({
      message: "Cannot refresh without being authenticated",
    }));

    const { refreshToken } = this.hooks.getApiCookie()!;

    return state.axiosInstance.post("auth/refresh", {
      refreshToken,
    }).then(r => {
      const tokens: {
        accessToken: string;
        refreshToken: string;
      } = r.data;

      const state = this.hooks.getApiState();

      assert(state.isAuthenticated, new AppError({
        message: "Authentication status changed mid-refresh",
      }));

      const userName = state.userName;

      this.becomeAuthenticated(userName, tokens);
    }).catch(e => {
      this.becomeUnauthenticated();
    });
  }

  private becomeAuthenticated(userName: string, tokens: ApiCookie) {
    const axiosInstance = this.hooks.getApiState().axiosInstance;

    this.hooks.setApiState({
      axiosInstance,
      isAuthenticated: true,
      userName,
    });

    this.hooks.setApiCookie(tokens);
  }

  private becomeUnauthenticated() {
    const axiosInstance = this.hooks.getApiState().axiosInstance;

    this.hooks.setApiState({
      axiosInstance,
      isAuthenticated: false,
    });

    this.hooks.setApiCookie(undefined);
  }
}