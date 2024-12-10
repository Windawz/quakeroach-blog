import { CommandResult } from "../lib/backend/apiHooks";
import { BlogPost } from "../lib/data/BlogPost";
import BlogPostDeleteButton from "./BlogPostDeleteButton";

export interface BlogPostFooterProps {
  blogPost: BlogPost;
  deleteResultHandler?: (result: CommandResult<undefined>) => void;
}

export default function BlogPostFooter({
  blogPost,
  deleteResultHandler,
}: BlogPostFooterProps): JSX.Element | undefined {
  const deleteButton = BlogPostDeleteButton({
    blogPost,
    resultHandler: deleteResultHandler,
  });

  if (deleteButton === undefined) {
    return undefined;
  }

  return (
    <div className="blog-post-view-footer">
      {deleteButton}
    </div>
  );
}