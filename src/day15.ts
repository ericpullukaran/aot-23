type BoxToys<Name extends string, Count> = Count extends number
  ? BuildArray<Count, Name>
  : never;

type BuildArray<
  Length extends number,
  Name extends string,
  Arr extends string[] = []
> = Arr["length"] extends Length
  ? Arr
  : BuildArray<Length, Name, [...Arr, Name]>;

import { Expect, Equal } from "type-testing";

type test_doll_actual = BoxToys<"doll", 1>;
//   ^?
type test_doll_expected = ["doll"];
type test_doll = Expect<Equal<test_doll_expected, test_doll_actual>>;

type test_nutcracker_actual = BoxToys<"nutcracker", 3 | 4>;
//   ^?
type test_nutcracker_expected =
  | ["nutcracker", "nutcracker", "nutcracker"]
  | ["nutcracker", "nutcracker", "nutcracker", "nutcracker"];
type test_nutcracker = Expect<
  Equal<test_nutcracker_expected, test_nutcracker_actual>
>;
