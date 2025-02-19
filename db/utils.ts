export function toBool(val: number) {
  return val === 1;
}

export function toDate(val: number) {
  return new Date(val * 1000);
}

export function fromBool(val: boolean) {
  return val ? 1 : 0;
}

export function fromDate(val: Date) {
  return Math.floor(val.getTime() / 1000);
}
