import './Button.css';
import Box from "./Box";

interface IButtonProps {
  url: string;
  children?: any;
}

export default function Button({ url, children } : IButtonProps) {
  return (
    <div className="button">
      <a href={url}>
        <Box>
          {children}
        </Box>
      </a>
    </div>
  );
}