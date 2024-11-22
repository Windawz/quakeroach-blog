import Container from './Container';
import './styles/ErrorDisplay.css';

interface ErrorDisplayProps {
  message?: string;
}

export default function ErrorDisplay({ message } : ErrorDisplayProps) {
  const text = message !== undefined
    ? `Error loading content: ${message}`
    : 'Error loading content';

  return (
    <span className="error-display">
      <Container>
        {text}
      </Container>
    </span>
  );
}