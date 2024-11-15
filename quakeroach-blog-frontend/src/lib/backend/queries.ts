import { Moment } from "moment";
import { QueryResult, useQuery } from "./apiHooks";
import moment from "moment";

export interface BlogPost {
  id: number;
  title: string;
  authorName: string;
  publishDate: Moment;
  content: string;
}

export function useBlogPosts({ maxCount, minPublishDate }: BlogPostQueryParams): QueryResult<BlogPost[]> {
  const result = useQuery<BlogPost[]>({
    method: "get",
    url: "blogPosts",
    params: {
      maxCount,
      minPublishDate: minPublishDate.format(),
    },
    resultDataTransform: (value) => (value as any[]).map((x): BlogPost => ({
      id: x.id,
      title: x.title,
      authorName: x.authorName,
      publishDate: moment(x.publishDate),
      content: x.content,
    })),
  });

  return result;
}

export interface BlogPostQueryParams {
  maxCount: number;
  minPublishDate: Moment;
}