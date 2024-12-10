import Container from './Container';
import { BlogPost } from '../lib/data/BlogPost';
import Separator from './Separator';
import BlogPostHeader from './BlogPostHeader';
import BlogPostBody from './BlogPostBody';

export interface BlogPostShortViewProps {
  blogPost: BlogPost;
}

export default function BlogPostShortView({
  blogPost,
} : BlogPostShortViewProps) {
  return (
    <Container className="blog-post-short-view">
      <BlogPostHeader
        blogPostId={blogPost.id}
        title={blogPost.title}
        authorName={blogPost.authorName}
        publishDate={blogPost.publishDate} />
      <Separator />
      <BlogPostBody content={blogPost.content} />
    </Container>
  );
}