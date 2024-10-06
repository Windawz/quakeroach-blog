import './Block.css'

export default function Block({
  width,
  height,
  children
} : {
  width? : number,
  height? : number,
  children? : any,
}) {
  return (
    <div className="block" style={{width: width, height: height}}>
      {children}
    </div>
  );
}