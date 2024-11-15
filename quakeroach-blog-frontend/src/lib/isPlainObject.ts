export function isPlainObject(x: any | undefined): x is object {
  return x?.constructor === Object;
}