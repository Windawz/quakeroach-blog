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

export interface UseCreateBlogPostParams {
  title: string;
  content: string;
}

export function useCreateBlogPost({ title, content }: UseCreateBlogPostParams): BodyCommandController<BlogPost> {
  return useCommand({
    method: "post",
    url: "/blogPosts",
  });
}