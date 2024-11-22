import { Moment } from "moment";

export interface BlogPost {
  id: number;
  title: string;
  authorName: string;
  publishDate: Moment;
  content: string;
}