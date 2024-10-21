import './WritePage.css';

export default function WritePage() {
  return (
    <div className='write-page'>
      <div className='editor-container box'>
        <textarea className='editor' name='editor' />
      </div>
    </div>
  );
}