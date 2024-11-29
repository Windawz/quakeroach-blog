import { AuthInfo } from "../lib/backend/useAuth";
import { BlogPost } from "../lib/data/BlogPost";
import BlogPostViewBody from "./BlogPostViewBody";
import BlogPostViewHeader from "./BlogPostViewHeader";
import Button from "./Button";
import Container from "./Container";
import Separator from "./Separator";

export interface BlogPostFullViewProps {
  blogPost: BlogPost;
  authInfo: AuthInfo;
  onDelete: () => void;
}

export default function BlogPostFullView({
  blogPost,
  authInfo,
  onDelete,
}: BlogPostFullViewProps) {
  const isAuthor = authInfo.isAuthenticated && authInfo.userName === blogPost.authorName;

  const footerButtons = [];

  if (isAuthor) {
    footerButtons.push((
      <Button kind="callback" callback={() => onDelete()}>
        Delete
      </Button>
    ));
  }

  const footer = footerButtons.length > 0
    ? (
      <>
        <Separator />
        {footerButtons}
      </>
    )
    : undefined;

  return (
    <Container className="blog-post-full-view">
      <BlogPostViewHeader
        blogPostId={blogPost.id}
        title={blogPost.title}
        authorName={blogPost.authorName}
        publishDate={blogPost.publishDate} />
      <Separator />
      <BlogPostViewBody
        content={blogPost.content} />
      {footer}
    </Container>
  );
}