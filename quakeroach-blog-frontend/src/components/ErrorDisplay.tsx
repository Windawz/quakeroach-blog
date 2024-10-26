import AppError from '../errors/AppError';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: Error;
}

export default function ErrorDisplay({ error } : ErrorDisplayProps) {
  let reason = '';

  if (process.env.NODE_ENV === 'development') {
    reason = reason.concat(`: ${error.name}`);
    if (error.message.length > 0) {
      reason = reason.concat(`: ${error.message}`);
    }
  } else if (error instanceof AppError && error.userFriendlyMessage !== undefined) {
    reason = reason.concat(` (${error.userFriendlyMessage})`);
  }

  return (
    <div className='error-display box'>
      Error loading content{reason}
    </div>
  );
}