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
    ['J', 'x', 'x'],
    ['J', 'J', 'J'],
  ],
  L: [
    ['x', 'x', 'L'],
    ['L', 'L', 'L'],
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
  public readonly piece;
  public position;
  public state;
  public readonly initState;
  public rotation;
  public readonly color: Color;

  constructor() {
    const { piece, position, state, rotation } = this._createNewPiece();
    this.piece = piece;
    this.color = PIECES_COLOR[piece];
    this.position = position;
    this.initState = state;
    this.state = state;
    this.rotation = rotation;
  }

  private _createNewPiece(): PieceProps {
    const piece = KIND_PIECES[Math.floor(Math.random() * KIND_PIECES.length)];
    const state = PIECES_INIT_STATE[piece];
    const midPiece = Math.floor(state[0].length / 2);
    const columns = 10;
    const midTable = Math.floor(columns/ 2);
    const position = { x: midTable - midPiece, y: 0 };
    const rotation = '1';
    return { piece, position, state, rotation };
  }

  public rotate(): void {
    // const newState = this._rotatePiece(this.state);
    // this.state = newState;
  }
}
