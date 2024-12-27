import { useState } from "react";
import Button from "./Button";
import Container from "./Container";
import TextBox from "./TextBox";
import './styles/BlogPostCommentEditor.css';
import { useAuth } from "../lib/backend/useAuth";
import { useCreateComment } from "../lib/backend/queries";

export interface BlogPostCommentEditorProps {
  blogPostId: number;
}

export default function BlogPostCommentEditor({
  blogPostId,
}: BlogPostCommentEditorProps) {
  const [name, setName] = useState("");
  const [contents, setContents] = useState("");
  const authController = useAuth();
  const createCommentController = useCreateComment(blogPostId);

  return (
    <Container className="blog-post-comment-editor">
      <div className="comment-editor-title-text">
        Comment on this post:
      </div>
      <form method="post" onSubmit={e => {
        e.preventDefault();
        
        createCommentController.execute({
          route: [],
          params: {},
          data: {
            authorName: authController.getAuthInfo().isAuthenticated
              ? name
              : undefined,
            contents,
          },
        });
      }}>
        <TextBox
          className="comment-text-text-box"
          kind="multiLine"
          label="Contents"
          onChange={x => setContents(x)} />
        {!authController.getAuthInfo().isAuthenticated
          ? <TextBox
            className="comment-author-name-text-box"
            kind="singleLine"
            type="text"
            label="Name"
            onChange={x => setName(x)} />
          : undefined}
        <Button
          className="comment-submit-button"
          kind="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
}