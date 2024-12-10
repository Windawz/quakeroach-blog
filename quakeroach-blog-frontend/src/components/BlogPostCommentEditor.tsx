import Container from "./Container";

export interface BlogPostCommentEditorProps {

}

export default function BlogPostCommentEditor({

}: BlogPostCommentEditorProps) {
  return (
    <Container className="blog-post-comment-editor">
      <textarea inputMode="text" />
    </Container>
  )
}