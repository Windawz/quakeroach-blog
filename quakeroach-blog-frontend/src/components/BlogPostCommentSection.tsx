import { BlogPost } from "../lib/data/BlogPost";
import BlogPostCommentEditor from "./BlogPostCommentEditor";
import BlogPostCommentList from "./BlogPostCommentList";

export interface BlogPostCommentSectionProps {
  blogPost: BlogPost;
}

export default function BlogPostCommentSection({
  blogPost,
}: BlogPostCommentSectionProps) {
  return (
    <div className="blog-post-comment-section">
      <BlogPostCommentList blogPostId={blogPost.id} />
      <BlogPostCommentEditor />
    </div>
  );
}