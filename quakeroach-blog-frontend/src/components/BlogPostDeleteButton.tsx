import { useEffect } from "react";
import { CommandResult } from "../lib/backend/apiHooks";
import { useDeleteBlogPost } from "../lib/backend/queries";
import { useAuth } from "../lib/backend/useAuth";
import { BlogPost } from "../lib/data/BlogPost";
import Button from "./Button";

export interface BlogPostDeleteButtonProps {
  blogPost: BlogPost;
  resultHandler?: (result: CommandResult<undefined>) => void;
}

export default function BlogPostDeleteButton({
  blogPost,
  resultHandler,
}: BlogPostDeleteButtonProps) {
  const authInfo = useAuth().getAuthInfo();
  const { execute, result } = useDeleteBlogPost();

  useEffect(() => {
    if (resultHandler !== undefined) {
      resultHandler(result);
    }
  }, [result, resultHandler]);

  const isAuthor = authInfo.isAuthenticated && authInfo.userName === blogPost.authorName;

  const onClick = () => {
    execute({ data: {}, params: {}, route: [blogPost.id] });
  };

  const deleteButton = (
    <Button className="blog-post-delete-button" kind="callback" callback={() => onClick()}>
      Delete
    </Button>
  );
  
  if (!isAuthor) {
    return undefined;
  }

  return deleteButton;
}