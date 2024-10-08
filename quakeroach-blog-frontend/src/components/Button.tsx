import Box from "./Box";

interface IButtonProps {
  text?: string;
  onClick?: () => void;
}

export default function Button({ text, onClick } : IButtonProps) {
  return (
    <div className="button" onClick={onClick}>
      <Box>
        {text}
      </Box>
    </div>
  );
}