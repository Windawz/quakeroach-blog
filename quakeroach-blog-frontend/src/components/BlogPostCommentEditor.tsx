import { useState } from "react";
import Container from "./Container";
import TextBox from "./TextBox";

export interface BlogPostCommentEditorProps {

}

export default function BlogPostCommentEditor({

}: BlogPostCommentEditorProps) {
  const [contents, setContents] = useState<string>("");

  return (
    <Container className="blog-post-comment-editor">
      <TextBox kind="multiLine" onChange={x => setContents(x)} />
    </Container>
  )
}