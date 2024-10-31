import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse } from "axios";
import moment, { Moment } from "moment";
import { envars } from "./envars";
import { BackendError } from "../errors/BackendError";

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
  reason: string;
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
          const endpoint = `/blogPosts`;
        
          let response = undefined;
          try {
            response = await axiosInstance.get(endpoint, {
              params: {
                maxCount: maxCount,
                minPublishDate: minPublishDate.format(),
              },
            });
          } catch (error) {
            throw toBackendError(endpoint, error as AxiosError);
          }
        
          return (response.data as any[]).map((x) => { return {
            id: x.id,
            title: x.title,
            publishDate: moment(x.publishDate),
            content: x.content,
          }});
        },
      
        async get(id: number): Promise<BlogPostOutput | undefined> {
          const endpoint = `/blogPosts/${id}`;
          
          let response = undefined;
          try {
            response = await axiosInstance.get(endpoint);
          } catch (error) {
            let axiosError = (error as AxiosError);
        
            if (axiosError.response?.status === 404) {
              return undefined;
            }
        
            throw toBackendError(endpoint, axiosError);
          }
        
          return {
            id: response.data.id,
            title: response.data.title,
            publishDate: moment(response.data.publishDate),
            content: response.data.content,
          };
        },
      
        async create({ title, content } : BlogPostCreationInput): Promise<number> {
          const endpoint = `/blogPosts`;
        
          let response = undefined;
          try {
            response = await axiosInstance.post(endpoint, {
              title: title,
              content: content,
            });
          } catch (error) {
            throw toBackendError(endpoint, error as AxiosError);
          }
  
          const location = tryGetLocation(response);
          
          if (location === undefined) {
            throw new BackendError({ endpoint, message: 'No location header in response to extract id from' });
          }
  
          return Number.parseInt(location.split('/').at(-1)!);
        },
      },

      auth: {
        async login({ userName, passwordText }: LoginInput): Promise<LoginOutput> {
          let response = undefined;

          try {
            response = await callApi(axiosInstance, "/auth/login", {
              method: "post",
              data: {
                userName: userName,
                passwordText: passwordText,
              },
            });
          } catch (e) {
            const error = e as BackendError;
            
            if (error.inner instanceof AxiosError && error.inner.status === 400) {
              return {
                isSuccessful: false,
                reason: 'Invalid user name or password',
              };
            } else {
              throw e;
            }
          }

          return {
            isSuccessful: true,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
        },

        async register({ userName, passwordText }: RegisterInput): Promise<void> {
          await callApi(axiosInstance, '/auth/register', {
            method: 'post',
            data: {
              userName: userName,
              passwordText: passwordText,
            },
          });
        },

        async refresh({ refreshToken }: RefreshInput): Promise<RefreshOutput> {
          const response = await callApi(axiosInstance, '/auth/refresh', {
            method: 'post',
            data: {
              refreshToken: refreshToken,
            },
          });

          return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
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

function toBackendError(endpoint: string, error: AxiosError) : BackendError {
  return new BackendError({ endpoint, inner: error });
}

function tryGetLocation<T, D>(response: AxiosResponse<T, D>) : string | undefined {
  if (!(response.headers instanceof AxiosHeaders) || !response.headers.has('Location')) {
    return undefined;
  }

  return (response.headers['Location'] as string);
}

interface ApiCallGetParams {
  method: 'get';
  params?: any;
}

interface ApiCallPostParams {
  method: 'post';
  params?: any;
  data?: any;
}

async function callApi(
  axiosInstance: AxiosInstance,
  endpoint: string,
  apiCallParams: ApiCallGetParams | ApiCallPostParams,
): Promise<AxiosResponse> {
  let response = undefined;

  try {
    if (apiCallParams.method === 'get') {
      response = await axiosInstance.get(endpoint, {
        params: apiCallParams.params,
      });
    } else if (apiCallParams.method === 'post') {
      response = await axiosInstance.post(endpoint, apiCallParams.data, {
        params: apiCallParams.params,
      });
    }
  } catch (error) {
    throw toBackendError(endpoint, error as AxiosError);
  }

  if (response === undefined) {
    throw new BackendError({
      endpoint: endpoint,
      message: 'Response is undefined',
    });
  }

  return response;
}