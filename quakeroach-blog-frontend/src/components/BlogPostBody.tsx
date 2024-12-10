import './styles/BlogPostBody.css';

export interface BlogPostBodyProps {
  content: string;
}

export default function BlogPostBody({ content }: BlogPostBodyProps) {
  return (
    <div className='blog-post-body'>
      {content}
    </div>
  );
}