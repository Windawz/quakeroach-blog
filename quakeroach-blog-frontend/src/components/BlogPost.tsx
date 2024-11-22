import { Moment } from 'moment';
import './BlogPost.css';
import Container from './Container';

interface BlogPostProps {
  id: number,
  title: string;
  authorName: string;
  publishDate: Moment;
  content: string;
}

export default function BlogPost({
  id,
  title,
  authorName,
  publishDate,
  content,
} : BlogPostProps) {
  return (
    <Container>
      <div className='blog-post-header'>
        <div className='blog-post-header-title'>
          <a href={`/blogpost/${id}`}>
            {title}
          </a>
        </div>
        <div className='blog-post-header-author'>
          by {authorName}
        </div>
        <div className='blog-post-header-date'>
          published at {publishDate.format()}
        </div>
      </div>
      <div className='separator' />
      <div className='blog-post-content'>
        {content}
      </div>
    </Container>
  );
}