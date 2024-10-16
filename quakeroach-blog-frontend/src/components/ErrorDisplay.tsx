import AppError from '../errors/AppError';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: AppError;
}

export default function ErrorDisplay({ error } : ErrorDisplayProps) {
  return (
    <div className='error-display box'>
      Error loading content{
        process.env.NODE_ENV === 'development'
          ? `: ${error.name}: ${error.message}`
          : error.userFriendlyMessage !== undefined
            ? ` (${error.userFriendlyMessage})`
            : ''
      }
    </div>
  );
}