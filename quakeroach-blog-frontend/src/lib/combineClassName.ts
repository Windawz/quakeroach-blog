export default function combineClassName(
  baseClassName: string,
  ...addedClassNames: (string | undefined)[]
) {
  return [baseClassName, ...addedClassNames].join(" ");
}