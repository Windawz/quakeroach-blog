import Container from './Container';
import { BlogPost } from '../lib/data/BlogPost';
import Separator from './Separator';
import BlogPostViewHeader from './BlogPostViewHeader';
import BlogPostViewBody from './BlogPostViewBody';

export interface BlogPostShortViewProps {
  blogPost: BlogPost;
}

export default function BlogPostShortView({
  blogPost,
} : BlogPostShortViewProps) {
  return (
    <Container className="blog-post-short-view">
      <BlogPostViewHeader
        blogPostId={blogPost.id}
        title={blogPost.title}
        authorName={blogPost.authorName}
        publishDate={blogPost.publishDate} />
      <Separator />
      <BlogPostViewBody content={blogPost.content} />
    </Container>
  );
}