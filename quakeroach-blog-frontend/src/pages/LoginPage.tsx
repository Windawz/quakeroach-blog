import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className='login-page'>
      <div className='login-container-outer'>
        <form className='box login-container' method='post'>
          <label>
            Username:
            <br />
            <input className='login-username' type='text' />
          </label>
          <label>
            Password:
            <br />
            <input className='login-password' type='text' />
          </label>
          <button className='box button' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}