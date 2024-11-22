import './styles/BlogPostView.css';
import Container from './Container';
import { BlogPost } from '../lib/data/BlogPost';

interface BlogPostViewProps {
  blogPost: BlogPost;
}

export default function BlogPostView({
  blogPost,
} : BlogPostViewProps) {
  return (
    <Container>
      <div className='blog-post-header'>
        <div className='blog-post-header-title'>
          <a href={`/blogpost/${blogPost.id}`}>
            {blogPost.title}
          </a>
        </div>
        <div className='blog-post-header-author'>
          by {blogPost.authorName}
        </div>
        <div className='blog-post-header-date'>
          published at {blogPost.publishDate.format()}
        </div>
      </div>
      <div className='separator' />
      <div className='blog-post-content'>
        {blogPost.content}
      </div>
    </Container>
  );
}