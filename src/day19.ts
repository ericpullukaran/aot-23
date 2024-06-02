type Items = ["🛹", "🚲", "🛴", "🏄"];

type BuildArray<
  Length extends number,
  Item extends String = "",
  Arr extends String[] = []
> = Arr["length"] extends Length
  ? Arr
  : BuildArray<Length, Item, [...Arr, Item]>;

type Next<N extends number> = N extends 0
  ? 1
  : N extends 1
  ? 2
  : N extends 2
  ? 3
  : N extends 3
  ? 0
  : never;

type Rebuild<
  T extends number[],
  Index extends number = 0,
  Arr extends unknown[] = []
> = T extends [infer F extends number, ...infer Rest extends number[]]
  ? Rebuild<Rest, Next<Index>, [...Arr, ...BuildArray<F, Items[Index]>]>
  : Arr;

import { Expect, Equal } from "type-testing";

type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>;
//   ^?
// prettier-ignore
type test_0_expected =  [
    '🛹', '🛹',
    '🚲',
    '🛴', '🛴', '🛴',
    '🏄', '🏄', '🏄',
    '🛹',
    '🚲',
    '🛴', '🛴',
  ];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>;
//   ^?
// prettier-ignore
type test_1_expected = [
    '🛹', '🛹', '🛹',
    '🚲', '🚲', '🚲',
    '🛴', '🛴',
    '🏄',
    '🛹', '🛹',
    '🚲',
    '🛴', '🛴'
  ];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>;
//   ^?
// prettier-ignore
type test_2_expected = [
    '🛹', '🛹',
    '🚲', '🚲', '🚲',
    '🛴', '🛴', '🛴',
    '🏄', '🏄', '🏄', '🏄', '🏄',
    '🛹',
    '🚲',
    '🛴', '🛴',
  ];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
