import './styles/BlogPostView.css';
import Container from './Container';
import { BlogPost } from '../lib/data/BlogPost';
import Separator from './Separator';
import { Link } from 'react-router-dom';

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
          <Link to={`/blogpost/${blogPost.id}`}>
            {blogPost.title}
          </Link>
        </div>
        <div className='blog-post-header-author'>
          by {blogPost.authorName}
        </div>
        <div className='blog-post-header-date'>
          published at {blogPost.publishDate.format()}
        </div>
      </div>
      <Separator />
      <div className='blog-post-content'>
        {blogPost.content}
      </div>
    </Container>
  );
}