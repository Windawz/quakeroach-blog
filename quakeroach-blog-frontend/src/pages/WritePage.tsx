import './WritePage.css';

export default function WritePage() {
  return (
    <div className='write-page'>
      <form className='box editor-container' method='post'>
        <label>
          Title:
          <br />
          <input className='editor-title' name='editor-title' type='text' />
        </label>
        <label>
          Content:
          <br />
          <textarea className='editor-content' name='editor-content' />
        </label>
        <button className='box button' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
}