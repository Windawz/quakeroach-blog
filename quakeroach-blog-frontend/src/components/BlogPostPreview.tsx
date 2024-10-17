import { Moment } from 'moment';
import './BlogPostPreview.css';

interface BlogPostPreviewProps {
  id: number,
  title: string;
  authorName: string;
  publishDate: Moment;
  content: string;
}

export default function BlogPostPreview({
  id,
  title,
  authorName,
  publishDate,
  content,
} : BlogPostPreviewProps) {
  return (
    <div className='blog-post-preview box'>
      <div className='blog-post-preview-header'>
        <div className='blog-post-preview-header-title'>
          <a href={`/blogpost/${id}`}>
            {title}
          </a>
        </div>
        <div className='blog-post-preview-header-author'>
          by {authorName}
        </div>
        <div className='blog-post-preview-header-date'>
          published at {publishDate.format()}
        </div>
      </div>
      <div className='separator' />
      <div className='blog-post-preview-content'>
        {content}
      </div>
    </div>
  );
}