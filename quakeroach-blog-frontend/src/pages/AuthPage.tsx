import './AuthPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/backend/detail/useAuth';

export default function AuthPage() {
  const {
    setInputUserName,
    setInputPasswordText,
    submitInput,
  } = useAuth();

  const navigate = useNavigate();
  const [failureMessage, setFailureMessage] = useState<string | undefined>(undefined);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = await submitInput();
    
    switch (result.kind) {
      case "success":
        navigate("/home");
        break;
      case "alreadyAuthenticated":
        setFailureMessage("Already logged in");
        break;
      case "error":
        setFailureMessage(result.message);
        break;
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-container-outer'>
        <form
          className='box auth-container'
          onSubmit={onSubmit}>
          <label>
            Username:
            <br />
            <input
              className='auth-username'
              type='text'
              onChange={e => {
                setInputUserName(e.target.value);
              }} />
          </label>
          <label>
            Password:
            <br />
            <input
              className='auth-password'
              type='password'
              onChange={e => {
                setInputPasswordText(e.target.value);
              }} />
          </label>
          {failureMessage === undefined
            ? (
              <></>
            )
            : (
              <div className='auth-failure-message'>
                {failureMessage}
              </div>
            )}
          <button
            className='box button'
            type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}