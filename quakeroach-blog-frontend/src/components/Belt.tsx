import './Belt.css';

interface IBeltProps {
  children?: any;
  direction: "horizontal" | "vertical";
}

export default function Belt({ children, direction } : IBeltProps) {
  return (
    <div className={`belt ${direction === "horizontal" ? "belt-horizontal" : "belt-vertical"}`}>
      {children}
    </div>
  );
}