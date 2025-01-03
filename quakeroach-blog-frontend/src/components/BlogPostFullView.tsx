import { CommandResult } from "../lib/backend/apiHooks";
import { BlogPost } from "../lib/data/BlogPost";
import BlogPostBody from "./BlogPostBody";
import BlogPostCommentSection from "./BlogPostCommentSection";
import BlogPostFooter from "./BlogPostFooter";
import BlogPostHeader from "./BlogPostHeader";
import Container from "./Container";
import Separator from "./Separator";
import './styles/BlogPostFullView.css';

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
    <div className="blog-post-full-view">
      <Container>
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
      <BlogPostCommentSection
        blogPost={blogPost} />
    </div>
    
  );
}