import ContentsDisplay from './ContentsDisplay';
import './styles/BlogPostBody.css';

export interface BlogPostBodyProps {
  content: string;
}

export default function BlogPostBody({ content }: BlogPostBodyProps) {
  return (
    <ContentsDisplay className="blog-post-body" text={content} />
  );
}