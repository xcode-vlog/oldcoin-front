export function numberWithCommas(x: number | string) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
}
export function phoneFormat(input: any) {
  if (!input || isNaN(input)) return `input must be a number was sent ${input}`;
  if (typeof input !== "string") input = input.toString();
  if (/^02/.test(input)) {
    return input.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  if (input.length === 10) {
    return input.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  if (input.length === 11) {
    return input.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  return input;
}
