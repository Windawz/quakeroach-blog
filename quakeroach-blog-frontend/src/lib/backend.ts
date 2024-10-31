import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse } from "axios";
import moment, { Moment } from "moment";
import { envars } from "./envars";
import { AppError } from "./errorHandling";

export interface BlogPostOutput {
  id: number;
  title: string;
  publishDate: Moment;
  content: string;
}

export interface BlogPostCreationInput {
  title: string;
  content: string;
}

export interface LoginInput {
  userName: string;
  passwordText: string;
}

export type LoginOutput = {
  isSuccessful: true;
  accessToken: string;
  refreshToken: string;
} | {
  isSuccessful: false;
  reason?: string;
}

export interface RegisterInput {
  userName: string;
  passwordText: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface RefreshOutput {
  accessToken: string;
  refreshToken: string;
}

export interface Backend {
  blogPosts: {
    getMany(
      maxCount: number,
      minPublishDate: Moment
    ): Promise<BlogPostOutput[]>;
    get(id: number): Promise<BlogPostOutput | undefined>;
    create(input: BlogPostCreationInput): Promise<number>;
  };

  auth: {
    login(input: LoginInput): Promise<LoginOutput>;
    register(input: RegisterInput): Promise<void>;
    refresh(input: RefreshInput): Promise<RefreshOutput>;
  };
}

export function getBackend(): Backend {
  const axiosInstance = getAxiosInstance();

  if (lazyBackend === undefined) {
    lazyBackend = {
      blogPosts: {
        async getMany(maxCount: number, minPublishDate: Moment) : Promise<BlogPostOutput[]> {
          const result = unwrapApiCallResult(
            await callApi(axiosInstance, '/blogPosts', {
              method: 'get',
              params: {
                maxCount,
                minPublishDate: minPublishDate.format(),
              },
            })
          );

          const data = result.response.data;
        
          return (data as any[]).map((x) => { return {
            id: x.id,
            title: x.title,
            publishDate: moment(x.publishDate),
            content: x.content,
          }});
        },
      
        async get(id: number): Promise<BlogPostOutput | undefined> {
          const result = await callApi(axiosInstance, `/blogPosts/${id}`, {
            method: 'get',
          });

          if (result.kind === 'badRequest' && result.statusCode === 404) {
            return undefined;
          }

          const data = unwrapApiCallResult(result).response.data;

          return {
            id: data.id,
            title: data.title,
            publishDate: moment(data.publishDate),
            content: data.content,
          };
        },
      
        async create({ title, content } : BlogPostCreationInput): Promise<number> {
          const result = unwrapApiCallResult(
            await callApi(axiosInstance, '/blogPosts', {
              method: 'post',
              data: {
                title,
                content,
              },
            })
          );
  
          const location = tryGetLocation(result.response);
          
          if (location === undefined) {
            throw new AppError({
              message: 'No location header in response to extract id from',
            });
          }
  
          return Number.parseInt(location.split('/').at(-1)!);
        },
      },

      auth: {
        async login({ userName, passwordText }: LoginInput): Promise<LoginOutput> {
          const result = await callApi(axiosInstance, "/auth/login", {
            method: "post",
            data: {
              userName: userName,
              passwordText: passwordText,
            },
          });

          if (result.kind === 'badRequest' && result.statusCode === 400) {
            return {
              isSuccessful: false,
              reason: result.errorMessage,
            };
          }

          const data = unwrapApiCallResult(result).response.data;

          return {
            isSuccessful: true,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        },

        async register({ userName, passwordText }: RegisterInput): Promise<void> {
          unwrapApiCallResult(
            await callApi(axiosInstance, "/auth/register", {
              method: "post",
              data: {
                userName: userName,
                passwordText: passwordText,
              },
            })
          );
        },

        async refresh({ refreshToken }: RefreshInput): Promise<RefreshOutput> {
          const result = unwrapApiCallResult(
            await callApi(axiosInstance, '/auth/refresh', {
              method: 'post',
              data: {
                refreshToken: refreshToken,
              },
            })
          );
          
          const data = result.response.data;

          return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        },
      },
    };
  }

  return lazyBackend;
};

var lazyAxiosInstance: AxiosInstance | undefined = undefined;
var lazyBackend: Backend | undefined = undefined;

function getAxiosInstance(): AxiosInstance {
  if (lazyAxiosInstance === undefined) {
    lazyAxiosInstance = axios.create({
      baseURL: envars.baseApiUrl,
    });
  }

  return lazyAxiosInstance;
}

function tryGetLocation<T, D>(response: AxiosResponse<T, D>) : string | undefined {
  if (!(response.headers instanceof AxiosHeaders) || !response.headers.has('Location')) {
    return undefined;
  }

  return (response.headers['Location'] as string);
}

type ApiCallParams = {
  method: 'get';
  params?: any;
} | {
  method: 'post';
  params?: any;
  data?: any;
}

async function callApi(
  axiosInstance: AxiosInstance,
  endpoint: string,
  apiCallParams: ApiCallParams
): Promise<ApiCallResult> {
  let response = undefined;

  try {
    if (apiCallParams.method === "get") {
      response = await axiosInstance.get(endpoint, {
        params: apiCallParams.params,
      });
    } else if (apiCallParams.method === "post") {
      response = await axiosInstance.post(endpoint, apiCallParams.data, {
        params: apiCallParams.params,
      });
    }
  } catch (error) {
    let errorResult: ApiCallResult | undefined = undefined;

    if (error instanceof AxiosError && error.response !== undefined) {
      const statusCode = error.response.status;
      const subStatusCode = statusCode - 400;

      if (subStatusCode >= 0 || subStatusCode < 100) {
        const errorMessage = error.response.data.errorMessage;

        errorResult = {
          endpoint,
          kind: "badRequest",
          statusCode,
          errorMessage:
            errorMessage !== undefined && typeof errorMessage === "string"
              ? errorMessage
              : undefined,
        };
      }
    }

    if (errorResult !== undefined) {
      return errorResult;
    }

    throw new AppError({
      cause: error,
    });
  }

  if (response === undefined) {
    throw new AppError({
      message: 'Response is undefined',
    });
  }

  return {
    endpoint,
    kind: "success",
    response,
  };
}

function unwrapApiCallResult(result: ApiCallResult): ApiCallSuccessResult {
  if (result.kind === 'success') {
    return result;
  }

  if (result.cause !== undefined) {
    throw result.cause;
  }

  throw new AppError({
    message: result.errorMessage,
  });
}

type ApiCallResult = { endpoint: string; } & (ApiCallSuccessResult | ApiCallBadRequestResult);

interface ApiCallSuccessResult {
  kind: "success";
  response: AxiosResponse;
}

interface ApiCallBadRequestResult {
  kind: "badRequest";
  statusCode: number;
  errorMessage?: string;
  cause?: unknown;
}