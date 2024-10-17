import './Button.css';

interface IButtonProps {
  className?: string;
  url: string;
  children?: any;
}

export default function Button({ className, url, children } : IButtonProps) {
  let resultingClassName = 'button box';

  if (className !== undefined) {
    resultingClassName = `${resultingClassName} ${className}`;
  }

  return (
    <a href={url} className={resultingClassName}>
      {children}
    </a>
  );
}