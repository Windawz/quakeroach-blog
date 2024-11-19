import { useState } from 'react';
import { useCreateBlogPost } from '../lib/backend/queries';
import './WritePage.css';

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
      <button
        className='box button'
        type='submit'>
        Submit
      </button>
    )
    : undefined;

  return (
    <div className='write-page'>
      <form className='box editor-container' method='post' onSubmit={(e) => {
        e.preventDefault();

        execute({
          data: {
            title,
            content,
          }
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
    </div>
  );
}