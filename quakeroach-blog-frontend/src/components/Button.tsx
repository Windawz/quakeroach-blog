import { Link } from 'react-router-dom';
import combineClassName from '../lib/combineClassName';
import Container from './Container';
import './styles/Button.css';

export type ButtonProps =
  CallbackButtonProps
  | LinkButtonProps
  | SubmitButtonProps;

export interface CallbackButtonProps extends ButtonPropsBase {
  kind: "callback";
  callback: React.MouseEventHandler;
}

export interface LinkButtonProps extends ButtonPropsBase {
  kind: "link";
  to: string;
}

export interface SubmitButtonProps extends ButtonPropsBase {
  kind: "submit";
}

interface ButtonPropsBase {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  const className = combineClassName("button", props.className);

  return (
    <Container id={props.id} className={className}>
      {createContentWrapper(props.children, props)}
    </Container>
  );
}

function createContentWrapper(content: React.ReactNode, props: ButtonProps) {
  const className = "button-content-wrapper";

  switch (props.kind) {
    case "callback":
      return (
        <div className={className} onClick={props.callback}>
          {content}
        </div>
      );
    case "link":
      return (
        <Link className={className} to={props.to}>
          {content}
        </Link>
      );
    case "submit":
      return (
        <button className={className} type="submit">
          {content}
        </button>
      );
  }
}