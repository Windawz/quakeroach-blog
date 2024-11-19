import { Moment } from "moment";
import { BodyCommandController, QueryResult, useCommand, useQuery } from "./apiHooks";

export interface BlogPost {
  id: number;
  title: string;
  authorName: string;
  publishDate: Moment;
  content: string;
}

export interface BlogPostQueryParams {
  maxCount: number;
  minPublishDate: Moment;
}

export function useBlogPosts({ maxCount, minPublishDate }: BlogPostQueryParams): QueryResult<BlogPost[]> {
  const result = useQuery<BlogPost[]>({
    method: "get",
    url: "blogPosts",
    params: {
      maxCount,
      minPublishDate,
    },
  });

  return result;
}

export interface CreateBlogPostExecuteData {
  title: string;
  content: string;
}

export function useCreateBlogPost(): BodyCommandController<BlogPost, undefined, CreateBlogPostExecuteData> {
  return useCommand({
    method: "post",
    url: "/blogPosts",
    executeDataTransform: (data) => ({
      title: data.title.trim(),
      content: data.content.trim(),
    }),
  });
}