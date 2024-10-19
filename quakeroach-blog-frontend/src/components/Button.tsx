import './Button.css';

interface BaseButtonProps {
  className?: string;
  children?: any;
}

interface UrlButtonProps extends BaseButtonProps {
  kind: 'urlButton';
  url: string;
}

interface ActionButtonProps extends BaseButtonProps {
  kind: 'actionButton';
  action: () => void;
}

type ButtonProps = UrlButtonProps | ActionButtonProps;

export default function Button(props : ButtonProps) {
  let resultingClassName = 'button box';

  if (props.className !== undefined) {
    resultingClassName = `${resultingClassName} ${props.className}`;
  }

  switch (props.kind) {
    case 'urlButton':
      return (
        <a href={props.url} className={resultingClassName}>
          {props.children}
        </a>
      );
    case 'actionButton':
      return (
        <div className={resultingClassName} onClick={props.action}>
          {props.children}
        </div>
      );
  }
}