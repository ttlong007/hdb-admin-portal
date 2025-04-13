export default function rangeMap(n: number, fn: (i: number) => any) {
  const arr = [];
  while (n > arr.length) {
    // @ts-ignore
    arr.push(fn(arr.length));
  }
  return arr;
}
