import './AuthPage.css';

export default function AuthPage() {
  return (
    <div className='auth-page'>
      <div className='auth-container-outer'>
        <form className='box auth-container' method='post'>
          <label>
            Username:
            <br />
            <input className='auth-username' type='text' />
          </label>
          <label>
            Password:
            <br />
            <input className='auth-password' type='text' />
          </label>
          <button className='box button' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}