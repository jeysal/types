import { expectType, expectAssignable, expectNotType } from 'tsd';
import { pipe, mergeRight } from '../es';

// object literals

const foobar = { foo: 'bar', bar: 'bar' };
const foo = { foo: 'foo' };
const bar = { bar: 'bar' };
const foo2 = { foo: 2 };

// without the `Extends` bit in the type definition, this would be `{ foo: string; bar: string; } & { foo: string ; }`
// which is redundant and looks bad as a return type
expectType<{ foo: string; bar: string; }>(mergeRight(foobar, foo));
expectType<{ foo: string; bar: string; }>(mergeRight(foobar)(foo));
expectType<{ foo: string; bar: string; }>(mergeRight(foobar, bar));
expectType<{ foo: string; bar: string; }>(mergeRight(foobar)(bar));
// we also expect a direct collapse of the types to avoid the ugly `{ foo: string } & { bar: string }`
expectNotType<{ foo: string } & { bar: string; }>(mergeRight(foo, bar));
expectNotType<{ foo: string } & { bar: string; }>(mergeRight(foo)(bar));
expectType<{ foo: string; bar: string; }>(mergeRight(foo, bar));
expectType<{ foo: string; bar: string; }>(mergeRight(foo)(bar));
// this is especially important when you merge objects with keys that have different types
expectNotType<{ foo: string } & { foo: number; }>(mergeRight(foo, bar));
expectNotType<{ foo: string } & { foo: number; }>(mergeRight(foo)(bar));
expectAssignable<{ foo: number; }>(mergeRight(foo, foo2));
expectAssignable<{ foo: number; }>(mergeRight(foo)(foo2));

// if L extends R, just return L
expectType<{ foobar: 'foo' | 'bar' }>(mergeRight({} as { foobar: 'foo' | 'bar' }, {} as { foobar: 'foo' }));
expectType<{ foo: string; bar: number; }>(mergeRight({} as { foo: string, bar: number }, {} as { foo: string }));
expectType<{ foo: string; bar: number; }>(mergeRight({} as { foo: string, bar: number }, {} as { foo: string }));
// because left is string and number, right, which are unions, L extends R
expectType<{ foo: string; bar: number; }>(mergeRight({} as { foo: string, bar: number }, {} as { foo: 'foo' | 'bar', bar: 1 | 2 | 3 }));

// typed objects

type Foo = {
  foo: string;
};

type Bar = {
  bar: string;
};

type Foobar = {
  foo: string;
  bar: string;
};

// `Foo & Bar` is ugly and poorly shows what you're actually getting back
expectNotType<Foo & Bar>(mergeRight({} as Foo, {} as Bar));
expectNotType<Foo & Bar>(mergeRight({} as Foo)({} as Bar));
// so instead the types are collapsed
expectType<{ foo: string, bar: string }>(mergeRight({} as Foo, {} as Bar));
expectType<{ foo: string, bar: string }>(mergeRight({} as Foo)({} as Bar));
// however, when `L extends R`, that should just return L
expectNotType<Foobar & Foo>(mergeRight({} as Foobar, {} as Foo));
expectNotType<Foobar & Foo>(mergeRight({} as Foobar)({} as Foo));
expectType<Foobar>(mergeRight({} as Foobar, {} as Foo));
expectType<Foobar>(mergeRight({} as Foobar)({} as Foo));
expectNotType<Foobar & Bar>(mergeRight({} as Foobar, {} as Bar));
expectNotType<Foobar & Bar>(mergeRight({} as Foobar)({} as Bar));
expectType<Foobar>(mergeRight({} as Foobar, {} as Bar));
expectType<Foobar>(mergeRight({} as Foobar)({} as Bar));

// this is especially important when merging an object literal into a typed object
expectNotType<Foobar & { foo: string }>(mergeRight({} as Foobar, foo));
expectNotType<Foobar & { foo: string }>(mergeRight({} as Foobar)(foo));
expectType<Foobar>(mergeRight({} as Foobar, foo));
expectType<Foobar>(mergeRight({} as Foobar)(foo));
expectNotType<Foobar & { bar: string }>(mergeRight({} as Foobar, bar));
expectNotType<Foobar & { bar: string }>(mergeRight({} as Foobar)(bar));
expectType<Foobar>(mergeRight({} as Foobar, bar));
expectType<Foobar>(mergeRight({} as Foobar)(bar));

// however, when any of the prop types do not match, we get back a new object and not an intersection
expectNotType<Foobar & { foo: number }>(mergeRight({} as Foobar, foo2));
expectNotType<Foobar & { foo: number }>(mergeRight({} as Foobar)(foo2));
expectType<{ foo: number; bar: string; }>(mergeRight({} as Foobar, foo2));
expectType<{ foo: number; bar: string; }>(mergeRight({} as Foobar)(foo2));

// these should also work both ways, as long as one type extends the other, choosing the more expansive type is ideal
expectNotType<Foo & Foobar>(mergeRight({} as Foo, {} as Foobar));
expectNotType<Foo & Foobar>(mergeRight({} as Foo)({} as Foobar));
expectType<Foobar>(mergeRight({} as Foo, {} as Foobar));
expectType<Foobar>(mergeRight({} as Foo)({} as Foobar));
expectNotType<Bar & Foobar>(mergeRight({} as Bar, {} as Foobar));
expectNotType<Bar & Foobar>(mergeRight({} as Bar)({} as Foobar));
expectType<Foobar>(mergeRight({} as Bar, {} as Foobar));
expectType<Foobar>(mergeRight({} as Bar)({} as Foobar));
expectNotType<{ foo: string } & Foobar>(mergeRight(foo, {} as Foobar));
expectNotType<{ foo: string } & Foobar>(mergeRight(foo)({} as Foobar));
expectType<Foobar>(mergeRight(foo, {} as Foobar));
expectType<Foobar>(mergeRight(foo)({} as Foobar));
expectNotType<{ bar: string } & Foobar>(mergeRight(bar, {} as Foobar));
expectNotType<{ bar: string } & Foobar>(mergeRight(bar)({} as Foobar));
expectType<Foobar>(mergeRight(bar, {} as Foobar));
expectType<Foobar>(mergeRight(bar)({} as Foobar));


// usage with pipe
type Entry = {
  type: string;
  payload: object;
  status: 'ok' | 'error';
};

// contrived example, lets `getEntry` might not actually has `status` set (even though its a required prop)
// and we'd like to default that to `ok`
// lets accomplish that with pipe
declare function getEntry(): Entry;
// we should expect the curried `mergeRight` to work with the incoming type via `pipe`
expectNotType<Entry>(pipe(mergeRight({ status: 'ok' }))(getEntry()));
expectNotType<Entry>(pipe(mergeRight({ status: 'foobar' }))(getEntry()));
// and for sanity, if `status` is say "foobar", then the outgoing type should not be `Entry`
// expectNotType<Entry>(pipe(mergeRight({ status: 'foobar' })(getEntry())));
// since `status: string`, the return object's`status` type needs to be made `string` as well
// otherwise status is still ``ok' | 'error'` but with an actual value of '`foobar'`!
expectType<{ type: string; payload: object; status: string; }>(pipe(mergeRight({ status: 'foobar' }))(getEntry()));
expectType<{ type: string; payload: object; status: 'ok' | 'error' | 'foobar'; }>(pipe(mergeRight({ status: 'foobar' } as const))(getEntry()));
