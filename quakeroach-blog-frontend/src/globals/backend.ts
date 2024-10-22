import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import moment, { Moment } from "moment";
import { envars } from "./envars";
import { BackendError } from "../errors/BackendError";

export interface BlogPostOutput {
  title: string;
  publishDate: Moment;
  content: string;
}

export interface BlogPostCreationInput {
  title: string;
  content: string;
}

const axiosInstance = axios.create({
  baseURL: envars.baseApiUrl,
});

function toBackendError(endpoint: string, error: AxiosError) : BackendError {
  return new BackendError({ endpoint, inner: error });
}

function tryGetLocation<T, D>(response: AxiosResponse<T, D>) : string | undefined {
  if (!(response.headers instanceof AxiosHeaders) || !response.headers.has('Location')) {
    return undefined;
  }

  return (response.headers['Location'] as string);
}

export const backend = {
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
};
