import { CommandResult } from "../lib/backend/apiHooks";
import { BlogPost } from "../lib/data/BlogPost";
import BlogPostBody from "./BlogPostBody";
import BlogPostFooter from "./BlogPostFooter";
import BlogPostHeader from "./BlogPostHeader";
import Container from "./Container";
import Separator from "./Separator";

export interface BlogPostFullViewProps {
  blogPost: BlogPost;
  deleteResultHandler?: (result: CommandResult<undefined>) => void;
}

export default function BlogPostFullView({
  blogPost,
  deleteResultHandler,
}: BlogPostFullViewProps) {
  const footer = BlogPostFooter({
    blogPost,
    deleteResultHandler,
  });

  return (
    <Container className="blog-post-full-view">
      <BlogPostHeader
        blogPostId={blogPost.id}
        title={blogPost.title}
        authorName={blogPost.authorName}
        publishDate={blogPost.publishDate} />
      <Separator />
      <BlogPostBody
        content={blogPost.content} />
      {footer !== undefined
        ? <>
          <Separator />
          {footer}
        </>
        : undefined}
    </Container>
  );
}