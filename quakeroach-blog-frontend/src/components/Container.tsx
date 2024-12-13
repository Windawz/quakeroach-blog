import { ReactNode } from "react";
import combineClassName from "../lib/combineClassName";
import "./styles/Container.css";

export interface ContainerProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}

export default function Container(props: ContainerProps) {
  const className = combineClassName("container", props.className);

  return (
    <div id={props.id} className={className}>
      {props.children}
    </div>
  );
}