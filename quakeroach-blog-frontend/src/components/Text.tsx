import './Text.css'

export default function Text({
    children
  } : {
    children: any,
}) {
  return (
    <div className="text">{children}</div>
  )
}