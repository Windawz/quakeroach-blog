import axios, { AxiosError, AxiosHeaders } from "axios";
import moment, { Moment } from "moment";
import { envars } from "./envars";
import { BackendError } from "../errors/BackendError";

interface BlogPostOutput {
  title: string;
  publishDate: Moment;
  content: string;
}

interface BlogPostCreationInput {
  title: string;
  content: string;
}

const axiosInstance = axios.create({
  baseURL: envars.baseApiUrl,
});

function toBackendError(endpoint: string, error: AxiosError) : BackendError {
  return new BackendError(endpoint, error.response?.statusText);
}

export const backend = {
  async getManyBlogPosts(maxCount: number, minPublishDate: Moment) : Promise<BlogPostOutput[]> {
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

  async getBlogPost(id: number): Promise<BlogPostOutput | undefined> {
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

  async createBlogPost({ title, content } : BlogPostCreationInput): Promise<number> {
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
  
    if (!(response.headers instanceof AxiosHeaders) || !response.headers.has('Location')) {
      throw new BackendError(endpoint, 'No location header in response to extract id from');
    }
  
    const location = (response.headers['Location'] as string);
    const id = Number.parseInt(location.split('/').at(-1)!);
  
    return id;
  },
};