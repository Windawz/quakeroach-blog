import './styles/AuthPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/backend/useAuth';
import Button from '../components/Button';
import Container from '../components/Container';
import TextBox from '../components/TextBox';

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
      <form className="auth-container-outer" onSubmit={onSubmit}>
        <Container className="auth-container">
          <TextBox
            kind="singleLine"
            type="text"
            label="Username"
            onChange={x => setInputUserName(x)} />
          <TextBox
            kind="singleLine"
            type="password"
            label="Password"
            onChange={x => setInputPasswordText(x)} />
          {failureMessage === undefined
            ? (
              <></>
            )
            : (
              <div className='auth-failure-message'>
                {failureMessage}
              </div>
            )}
          <Button kind="submit">
            Submit
          </Button>
        </Container>
      </form>
    </div>
  );
}