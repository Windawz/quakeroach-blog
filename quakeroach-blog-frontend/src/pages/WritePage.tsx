import './WritePage.css';

export default function WritePage() {
  return (
    <div className='write-page'>
      <form className='box editor-container' method='post'>
        <label className='editor-label'>
          Title:
          <br />
          <input className='editor-title' name='editor-title' type='text' />
        </label>
        <label className='editor-label'>
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