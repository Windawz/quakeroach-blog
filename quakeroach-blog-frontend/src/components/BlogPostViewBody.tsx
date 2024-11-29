import './styles/BlogPostViewBody.css';

export interface BlogPostViewBodyProps {
  content: string;
}

export default function BlogPostViewBody({ content }: BlogPostViewBodyProps) {
  return (
    <div className='blog-post-view-body'>
      {content}
    </div>
  );
}