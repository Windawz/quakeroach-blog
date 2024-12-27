import { Moment } from "moment";

export interface Comment {
  id: number;
  blogPostId: number;
  authorName: string;
  publishDate: Moment;
  contents: string;
}