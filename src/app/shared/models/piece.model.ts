import {
  Color,
  PieceProps,
  TableFillSpace,
  TypePiece,
} from '../interfaces/piece.interface';

export const KIND_PIECES: Readonly<TypePiece[]> = [
  'I',
  'O',
  'T',
  'S',
  'Z',
  'J',
  'L',
] as const;

export const PIECES_INIT_STATE: Readonly<
  Record<TypePiece, TableFillSpace[][]>
> = {
  I: [['I', 'I', 'I', 'I']],
  O: [
    ['O', 'O'],
    ['O', 'O'],
  ],
  T: [
    ['T', 'T', 'T'],
    ['x', 'T', 'x'],
  ],
  S: [
    ['x', 'S', 'S'],
    ['S', 'S', 'x'],
  ],
  Z: [
    ['Z', 'Z', 'x'],
    ['x', 'Z', 'Z'],
  ],
  J: [
    ['J', 'J', 'J'],
    ['x', 'x', 'J'],
  ],
  L: [
    ['L', 'L', 'L'],
    ['L', 'x', 'x'],
  ],
};

export const PIECES_COLOR: Readonly<Record<TypePiece, Color>> = {
  I: 'red',
  O: 'blue',
  T: 'green',
  S: 'yellow',
  Z: 'purple',
  J: 'orange',
  L: 'fuchsia',
} as const;

export class Piece implements PieceProps {
  public readonly type: TypePiece;
  public position: { x: number; y: number };
  public state: TableFillSpace[][];
  public readonly initState: TableFillSpace[][];
  public rotation: '1' | '2' | '3' | '4';
  public readonly color: Color;

  constructor(clonePiece?: Piece) {
    const { type, position, state, rotation } =
      clonePiece ?? this._createNewPiece();
    const { initState } = clonePiece || {};
    const { x: posX, y: posY } = position;
    this.type = type;
    this.color = PIECES_COLOR[type];
    this.position = { x: posX, y: posY };
    this.initState = (initState ?? state).map((row) => [...row]);
    this.state = state.map((row) => [...row]);
    this.rotation = rotation;
  }

  private _createNewPiece(): PieceProps {
    const type = KIND_PIECES[Math.floor(Math.random() * KIND_PIECES.length)];
    const state = PIECES_INIT_STATE[type];
    const midPiece = Math.floor(state[0].length / 2);
    const columns = 10;
    const midTable = Math.floor(columns / 2);
    const position = { x: midTable - midPiece, y: 0 };
    const rotation = '1';
    return { type, position, state, rotation };
  }

  public clonePiece(): Piece {
    return new Piece(this);
  }

  public rotate(): void {
    // const newState = this._rotatePiece(this.state);
    // this.state = newState;
  }
}
