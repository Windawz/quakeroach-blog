export default function combineClassName(
  baseClassName: string,
  addedClassName: string | undefined,
) {
  return [baseClassName, addedClassName].join(" ");
}