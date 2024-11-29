import { Moment } from "moment";
import { BodyCommandController, QueryResult, useCommand, useQuery } from "./apiHooks";
import { BlogPost } from "../data/BlogPost";

export interface BlogPostQueryParams {
  id: number;
}

export function useBlogPost({ id }: BlogPostQueryParams): QueryResult<BlogPost> {
  return useQuery<BlogPost>({
    method: "get",
    url: `blogPosts/${id}`,
  });
}

export interface BlogPostsQueryParams {
  maxCount: number;
  minPublishDate: Moment;
}

export function useBlogPosts({ maxCount, minPublishDate }: BlogPostsQueryParams): QueryResult<BlogPost[]> {
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

export function useDeleteBlogPost(): BodyCommandController<undefined, { id: number }, undefined> {
  return useCommand({
    method: "delete",
    url: "/blogPosts",
  });
}