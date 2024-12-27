import { Moment } from "moment";
import { BodyCommandController, QueryResult, useCommand, useQuery } from "./apiHooks";
import { BlogPost } from "../data/BlogPost";
import { Comment } from "../data/Comment";

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
  minPublishDate?: Moment;
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

export interface CreateBlogPostData {
  title: string;
  content: string;
}

export function useCreateBlogPost(): BodyCommandController<BlogPost, [], {}, CreateBlogPostData> {
  return useCommand({
    method: "post",
    url: "/blogPosts",
    dataTransform: (data) => ({
      title: data.title.trim(),
      content: data.content.trim(),
    }),
  });
}

export function useDeleteBlogPost(): BodyCommandController<undefined, [number], {}, {}> {
  return useCommand({
    method: "delete",
    url: "/blogPosts",
  });
}

export function useComment(id: number): QueryResult<Comment> {
  return useQuery({
    method: "get",
    url: `/comments/${id}`,
  });
}

export interface UseCommentsQueryParams {
  blogPostId: number;
  maxCount: number;
  minPublishDate?: Moment;
}

export function useComments({
  blogPostId,
  maxCount,
  minPublishDate,
}: UseCommentsQueryParams): QueryResult<Comment[]> {
  return useQuery({
    method: "get",
    url: `/blogPosts/${blogPostId}/comments`,
    params: {
      maxCount,
      minPublishDate,
    },
  });
}

export interface UseCreateCommentData {
  authorName?: string;
  contents: string;
}

export function useCreateComment(blogPostId: number): BodyCommandController<Comment, [], {}, UseCreateCommentData> {
  return useCommand({
    method: "post",
    url: `/blogPosts/${blogPostId}/comments`,
    dataTransform: (data) => ({
      authorName: data.authorName?.trim(),
      contents: data.contents.trim(),
    }),
  });
}

export function useDeleteComment(): BodyCommandController<undefined, [number], {}, {}> {
  return useCommand({
    method: "delete",
    url: `/comments`,
  });
}