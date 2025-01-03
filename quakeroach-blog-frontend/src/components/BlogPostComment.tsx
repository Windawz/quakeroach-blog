import { Moment } from "moment";
import Container from "./Container";
import ContentsDisplay from "./ContentsDisplay";
import Separator from "./Separator";
import './styles/BlogPostComment.css';

export interface BlogPostCommentProps {
  authorName: string;
  publishDate: Moment;
  contents: string;
}

export default function BlogPostComment(props: BlogPostCommentProps) {
  return (
    <Container className="comment">
      <div className="author">
        from <span className="name">{props.authorName}</span>
      </div>
      <div className="publish-date">
        at {props.publishDate.format()}
      </div>
      <Separator />
      <ContentsDisplay className="contents" text={props.contents} />
    </Container>
  );
}