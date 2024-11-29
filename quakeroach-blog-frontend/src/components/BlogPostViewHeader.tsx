import './styles/BlogPostViewHeader.css';
import { Moment } from "moment";
import { Link } from "react-router-dom";

export interface BlogPostViewHeaderProps {
  blogPostId: number;
  title: string;
  authorName: string;
  publishDate: Moment;
}

export default function BlogPostViewHeader({
  blogPostId,
  title,
  authorName,
  publishDate,
}: BlogPostViewHeaderProps) {
  return (
    <div className="blog-post-view-header">
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