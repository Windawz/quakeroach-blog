import './styles/BlogPostHeader.css';
import { Moment } from "moment";
import { Link } from "react-router-dom";

export interface BlogPostHeaderProps {
  blogPostId: number;
  title: string;
  authorName: string;
  publishDate: Moment;
}

export default function BlogPostHeader({
  blogPostId,
  title,
  authorName,
  publishDate,
}: BlogPostHeaderProps) {
  return (
    <div className="blog-post-header">
      <Link className="title" to={`/blogpost/${blogPostId}`}>
        {title}
      </Link>
      <div className="author">
        by {authorName}
      </div>
      <div className="date">
        published at {publishDate.format()}
      </div>
    </div>
  );
}