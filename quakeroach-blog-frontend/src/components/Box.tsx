export default function Box({ children } : { children?: any }) {
  return (
    <div className="box">
      {children}
    </div>
  );
}