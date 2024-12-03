import { useState } from 'react';
import { useCreateBlogPost } from '../lib/backend/queries';
import './styles/WritePage.css';
import Button from '../components/Button';
import Container from '../components/Container';

export default function WritePage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const { result, execute } = useCreateBlogPost();

  const completionDisplay = result.kind === "success" || result.kind === "error"
    ? (
      <div className="box">
        {result.kind === "success"
          ? `Created! (${JSON.stringify(result.data)})`
          : `Error! (${result.status}: ${result.message})`}
      </div>
    )
    : undefined;

  const submitButton = result.kind === "dormant"
    ? (
      <Button kind="submit">
        Submit
      </Button>
    )
    : undefined;

  return (
    <div className='write-page'>
      <Container>
        <form className='editor-container' method='post' onSubmit={(e) => {
          e.preventDefault();

          execute({
            route: [],
            params: {},
            data: {
              title,
              content,
            },
          });
        }}>
          <label>
            Title:
            <br />
            <input
              className='editor-title'
              name='editor-title'
              type='text'
              onChange={(e) => {
                setTitle(e.target.value);
              }} />
          </label>
          <label>
            Content:
            <br />
            <textarea
              className='editor-content'
              name='editor-content'
              onChange={(e) => {
                setContent(e.target.value);
              }} />
          </label>
          {completionDisplay ?? submitButton}
        </form>
      </Container>
    </div>
  );
}