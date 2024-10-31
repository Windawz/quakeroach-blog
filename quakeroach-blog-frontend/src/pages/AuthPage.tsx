import { useCookies } from 'react-cookie';
import './AuthPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forwardErrors } from '../lib/errorHandling';
import { getBackend } from '../lib/backend';
import { BackendError } from '../errors/BackendError';

export default function AuthPage() {
  const [, setCookie, ] = useCookies(['quakeroach-blog-tokens']);

  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>('');
  const [passwordText, setPasswordText] = useState<string>('');
  const [failureMessage, setFailureMessage] = useState<string | undefined>(undefined);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await forwardErrors(
      (e) => {
        const error = e as BackendError;
        const message = error.userFriendlyMessage !== undefined
          ? error.userFriendlyMessage
          : 'Unknown error';

        setFailureMessage(message);
      },
      async () => {
        setFailureMessage(undefined);

        const response = await getBackend().auth.login({
          userName: userName,
          passwordText: passwordText,
        });

        if (!response.isSuccessful) {
          setFailureMessage(response.reason);
        } else {
          const { accessToken, refreshToken } = response;
          
          setCookie('quakeroach-blog-tokens', { accessToken, refreshToken });
          navigate('/home');
        }
      }
    );
  }

  function onUserNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }

  function onPasswordTextInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordText(e.target.value)
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
              onChange={onUserNameInputChange} />
          </label>
          <label>
            Password:
            <br />
            <input
              className='auth-password'
              type='password'
              onChange={onPasswordTextInputChange} />
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