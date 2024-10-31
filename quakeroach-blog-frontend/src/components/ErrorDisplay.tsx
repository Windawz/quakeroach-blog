import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: Error;
}

export default function ErrorDisplay({ error } : ErrorDisplayProps) {
  const text = error.message?.length
    ? `Error loading content: ${error.message}`
    : 'Error loading content';

  return (
    <div className='error-display box'>
      {text}
    </div>
  );
}