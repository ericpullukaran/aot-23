type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
  board: EmptyBoard;
  state: "❌";
};

type Game = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type PositionMap = {
  top: "0";
  middle: "1";
  bottom: "2";
  left: "0";
  center: "1";
  right: "2";
};
type ExtractNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;

type UpdateBoard<
  B extends TicTactToeBoard,
  Y extends keyof PositionMap,
  X extends keyof PositionMap,
  C extends TicTacToeChip
> = Y extends "top"
  ? X extends "left"
    ? [[C, B[0][1], B[0][2]], B[1], B[2]]
    : X extends "center"
    ? [[B[0][0], C, B[0][2]], B[1], B[2]]
    : X extends "right"
    ? [[B[0][0], B[0][1], C], B[1], B[2]]
    : never
  : Y extends "middle"
  ? X extends "left"
    ? [B[0], [C, B[1][1], B[1][2]], B[2]]
    : X extends "center"
    ? [B[0], [B[1][0], C, B[1][2]], B[2]]
    : X extends "right"
    ? [B[0], [B[1][0], B[1][1], C], B[2]]
    : never
  : Y extends "bottom"
  ? X extends "left"
    ? [B[0], B[1], [C, B[2][1], B[2][2]]]
    : X extends "center"
    ? [B[0], B[1], [B[2][0], C, B[2][2]]]
    : X extends "right"
    ? [B[0], B[1], [B[2][0], B[2][1], C]]
    : never
  : never;

type SelectCell<
  B extends TicTactToeBoard,
  Y extends keyof PositionMap,
  X extends keyof PositionMap
> = B[ExtractNumber<PositionMap[Y]>][ExtractNumber<PositionMap[X]>];

type ToggleState<S extends TicTacToeState> = S extends "❌" ? "⭕" : "❌";

type IsUniformTupleSpecific<
  T extends TicTacToeCell[],
  Chip extends TicTacToeChip
> = T extends [Chip, ...infer Rest]
  ? Rest extends TicTacToeCell[]
    ? Rest extends []
      ? true
      : Rest[0] extends Chip
      ? IsUniformTupleSpecific<Rest, Chip>
      : false
    : false
  : false;

type CheckWinCondition<B extends TicTactToeBoard, Chip extends TicTacToeChip> =
  // Check rows
  IsUniformTupleSpecific<B[0], Chip> extends true
    ? true
    : IsUniformTupleSpecific<B[1], Chip> extends true
    ? true
    : IsUniformTupleSpecific<B[2], Chip> extends true
    ? true
    : // Check columns
    IsUniformTupleSpecific<[B[0][0], B[1][0], B[2][0]], Chip> extends true
    ? true
    : IsUniformTupleSpecific<[B[0][1], B[1][1], B[2][1]], Chip> extends true
    ? true
    : IsUniformTupleSpecific<[B[0][2], B[1][2], B[2][2]], Chip> extends true
    ? true
    : // Check diagonals
    IsUniformTupleSpecific<[B[0][0], B[1][1], B[2][2]], Chip> extends true
    ? true
    : IsUniformTupleSpecific<[B[0][2], B[1][1], B[2][0]], Chip> extends true
    ? true
    : false;

type CheckFullRows<B extends TicTactToeBoard> = {
  [K in keyof B]: IsUniformTupleSpecific<B[K], TicTacToeChip> extends true
    ? "⭕"
    : "  ";
};
type IsBoardFull<B extends TicTactToeBoard> = IsUniformTupleSpecific<
  CheckFullRows<B>,
  "⭕"
>;

type StateCompute<G extends Game> = CheckWinCondition<
  G["board"],
  "❌"
> extends true
  ? CheckWinCondition<G["board"], "⭕"> extends true
    ? "Draw"
    : "❌ Won"
  : CheckWinCondition<G["board"], "⭕"> extends true
  ? "⭕ Won"
  : IsBoardFull<G["board"]> extends true
  ? "Draw"
  : ToggleState<G["state"]>;

type ExtractChip<S> = S extends TicTacToeChip ? S : never;
type NextBoard<
  G extends Game,
  Y extends keyof PositionMap,
  X extends keyof PositionMap
> = UpdateBoard<G["board"], Y, X, ExtractChip<G["state"]>>;
type ValidateMove<
  G extends Game,
  Y extends keyof PositionMap,
  X extends keyof PositionMap
> = SelectCell<G["board"], Y, X> extends TicTacToeChip ? false : true;

type TicTacToe<
  G extends Game,
  P extends TicTacToePositions
> = P extends `${infer Y}-${infer X}`
  ? Y extends keyof PositionMap
    ? X extends keyof PositionMap
      ? ValidateMove<G, Y, X> extends true
        ? {
            board: NextBoard<G, Y, X>;
            state: StateCompute<{
              board: NextBoard<G, Y, X>;
              state: G["state"];
            }>;
          }
        : G
      : never
    : never
  : never;

import { Equal, Expect } from "type-testing";

type test_move1_actual = TicTacToe<NewGame, "top-center">;
//   ^?
// prettier-ignore
type test_move1_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, "top-left">;
//   ^?
// prettier-ignore
type test_move2_expected = {
  board: [
    ['⭕', '❌', '  '], 
    ['  ', '  ', '  '], 
    ['  ', '  ', '  ']];
  state: '❌';
}
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, "middle-center">;
//   ^?
// prettier-ignore
type test_move3_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, "bottom-left">;
//   ^?
// prettier-ignore
type test_move4_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '  ' ]
  ];
  state: '❌';
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_x_win_actual = TicTacToe<test_move4_actual, "bottom-center">;
//   ^?
// prettier-ignore
type test_x_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '❌', '  ' ]
  ];
  state: '❌ Won';
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, "bottom-right">;
//   ^?
// prettier-ignore
type type_move5_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕';
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, "middle-left">;
//   ^?
// prettier-ignore
type test_o_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '⭕', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕ Won';
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, "top-center">;
//   ^?
// prettier-ignore
type test_invalid_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

// prettier-ignore
type test_before_draw = {
  board: [
    ['⭕', '❌', '⭕'], 
    ['⭕', '❌', '❌'], 
    ['❌', '⭕', '  ']];
  state: '⭕';
}
type test_draw_actual = TicTacToe<test_before_draw, "bottom-right">;
//   ^?
// prettier-ignore
type test_draw_expected = {
  board: [
    ['⭕', '❌', '⭕'], 
    ['⭕', '❌', '❌'], 
    ['❌', '⭕', '⭕']];
  state: 'Draw';
}
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
