import Button from "./Button";

interface ILinkButtonProps {
  text?: string;
  url: string;
}

export default function LinkButton({ text, url } : ILinkButtonProps) {
  return (
    <div className="link-button">
      <a href={url}>
        <Button text={text} />
      </a>
    </div>
  );
}