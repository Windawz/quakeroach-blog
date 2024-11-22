import { ReactNode } from "react";
import "./styles/Container.css";

export interface ContainerProps {
  children?: ReactNode;
}

export default function Container({
  children,
}: ContainerProps) {
  return (
    <div className="container">
      {children}
    </div>
  );
}