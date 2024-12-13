import { useState } from 'react';
import { useCreateBlogPost } from '../lib/backend/queries';
import './styles/WritePage.css';
import Button from '../components/Button';
import Container from '../components/Container';
import TextBox from '../components/TextBox';

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
        <form method='post' onSubmit={(e) => {
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
          <TextBox
            kind="singleLine"
            type="text"
            label="Title"
            onChange={x => setTitle(x)} />
          <TextBox
            className="contents-text-box"
            kind="multiLine"
            label="Contents"
            onChange={x => setContent(x)} />
          {completionDisplay ?? submitButton}
        </form>
      </Container>
    </div>
  );
}