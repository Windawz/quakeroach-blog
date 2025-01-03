import { useComments } from "../lib/backend/queries";
import { AppError } from "../lib/errorHandling";
import BlogPostComment from "./BlogPostComment";
import Container from "./Container";

export interface BlogPostCommentListProps {
  blogPostId: number;
}

export default function BlogPostCommentList({
  blogPostId,
}: BlogPostCommentListProps) {
  const commentsResult = useComments({
    blogPostId,
    maxCount: 10,
  });

  let main = (
    <Container>
      Pending...
    </Container>
  );

  if (commentsResult.kind === "error") {
    throw new AppError({
      message: commentsResult.message,
    });
  }

  if (commentsResult.kind === "success") {
    const comments = commentsResult.data.map(x => (
      <BlogPostComment authorName={x.authorName} publishDate={x.publishDate} contents={x.contents} />
    ));

    if (comments.length === 0) {
      main = (
        <Container className="no-comments-container">
          No one has commented on this post yet
        </Container>
      );
    } else {
      main = (
        <>{comments}</>
      );
    }
  }

  return (
    <div className="blog-post-comment-list">
      {main}
    </div>
  );
}