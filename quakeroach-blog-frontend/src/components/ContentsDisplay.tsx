import combineClassName from '../lib/combineClassName';
import './styles/ContentsDisplay.css';

export interface ContentsDisplayProps {
  className?: string;
  text: string;
}

export default function ContentsDisplay(props: ContentsDisplayProps) {
  return (
    <div className={combineClassName("contents-display", props.className)}>
      {props.text}
    </div>
  );
}