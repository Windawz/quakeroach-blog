import axios, { AxiosError, AxiosHeaders, AxiosInstance } from "axios";
import moment, { Moment } from "moment";

export default class BackendClient {
  private readonly axiosInstance: AxiosInstance;
  
  constructor(baseApiUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseApiUrl,
    });
  }

  async getMany(maxCount: number, minPublishDate: Moment) : Promise<BlogPostOutput[]> {
    const endpoint = `/blogPosts`;

    let response = undefined;
    try {
      response = await this.axiosInstance.get(endpoint, {
        params: {
          maxCount: maxCount,
          minPublishDate: minPublishDate.format(),
        },
      });
    } catch (error) {
      throw BackendClientError.fromAxiosError(endpoint, error as AxiosError);
    }

    return (response.data as any[]).map((x) => { return {
      title: x.title,
      publishDate: moment(x.publishDate),
      content: x.content,
    }});
  }

  async get(id: number): Promise<BlogPostOutput | undefined> {
    const endpoint = `/blogPosts/${id}`;
    
    let response = undefined;
    try {
      response = await this.axiosInstance.get(endpoint);
    } catch (error) {
      let axiosError = (error as AxiosError);

      if (axiosError.response?.status === 404) {
        return undefined;
      }

      throw BackendClientError.fromAxiosError(endpoint, axiosError);
    }

    return {
      title: response.data.title,
      publishDate: moment(response.data.publishDate),
      content: response.data.content,
    };
  }

  async create({ title, content } : BlogPostCreationInput): Promise<number> {
    const endpoint = `/blogPosts`;

    let response = undefined;
    try {
      response = await this.axiosInstance.post(endpoint, {
        title: title,
        content: content,
      });
    } catch (error) {
      throw BackendClientError.fromAxiosError(endpoint, error as AxiosError);
    }

    if (!(response.headers instanceof AxiosHeaders) || !response.headers.has('Location')) {
      throw new BackendClientError(endpoint, 'No location header in response to extract id from');
    }

    const location = (response.headers['Location'] as string);
    const id = Number.parseInt(location.split('/').at(-1)!);

    return id;
  }
}

export class BackendClientError extends Error {
  public readonly endpoint: string;

  constructor(endpoint: string, message?: string) {
    super(message);

    this.endpoint = endpoint;
  }

  static fromAxiosError(endpoint: string, error: AxiosError) : BackendClientError {
    return new BackendClientError(endpoint, error.response?.statusText);
  }
}

interface BlogPostOutput {
  title: string;
  publishDate: Moment;
  content: string;
}

interface BlogPostCreationInput {
  title: string;
  content: string;
}