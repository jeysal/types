export function pipe<TArgs extends any[], R1>(f1: (...args: TArgs) => R1): (...args: TArgs) => R1;
export function pipe<TArgs extends any[], R1, R2>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
): (...args: TArgs) => R2;
export function pipe<TArgs extends any[], R1, R2, R3>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
): (...args: TArgs) => R3;
export function pipe<TArgs extends any[], R1, R2, R3, R4>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
): (...args: TArgs) => R4;
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
  f5: (a: R4) => R5,
): (...args: TArgs) => R5;
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
  f5: (a: R4) => R5,
  f6: (a: R5) => R6,
): (...args: TArgs) => R6;
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7>(
  f1: (...args: TArgs) => R1,
  f2: (a: R1) => R2,
  f3: (a: R2) => R3,
  f4: (a: R3) => R4,
  f5: (a: R4) => R5,
  f6: (a: R5) => R6,
  f7: (a: R6) => R7,
): (...args: TArgs) => R7;
// fallback overload that covers anything greater than 7, but doesn't type check between functions
export function pipe<TArgs extends any[], R1, TResult>(
  ...funcs: [
    f1: (...args: TArgs) => R1,
    ...func: Array<(a: any) => any>,
    fnLast: (a: any) => TResult
  ]
): (...args: TArgs) => TResult;
