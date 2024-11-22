import { ReactNode } from "react";
import "./styles/Container.css";

export interface ContainerProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}

export default function Container(props: ContainerProps) {
  const className = ["container", props.className].join(' ');

  return (
    <div id={props.id} className={className}>
      {props.children}
    </div>
  );
}