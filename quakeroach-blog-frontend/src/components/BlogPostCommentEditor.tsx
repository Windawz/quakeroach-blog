import { useState } from "react";
import Button from "./Button";
import Container from "./Container";
import TextBox from "./TextBox";
import './styles/BlogPostCommentEditor.css';
import { useAuth } from "../lib/backend/useAuth";

export default function BlogPostCommentEditor() {
  const [name, setName] = useState("");
  const [contents, setContents] = useState("");
  const authController = useAuth();

  return (
    <Container className="blog-post-comment-editor">
      <div className="comment-editor-title-text">
        Comment on this post:
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        
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