import {
  PieceProps,
  TableFillSpace,
  TypePiece,
} from '../interfaces/piece.interface';

export const KIND_PIECES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;

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

export class Piece implements PieceProps {
  public readonly piece;
  public position;
  public state;
  public readonly initState;
  public rotation;

  constructor() {
    const { piece, position, state, rotation, initState } =
      this._createNewPiece();
    this.piece = piece;
    this.position = position;
    this.initState = initState;
    this.state = state;
    this.rotation = rotation;
  }

  private _createNewPiece(): PieceProps {
    const piece = KIND_PIECES[Math.floor(Math.random() * KIND_PIECES.length)];
    const position = { x: 4, y: 0 };
    const state = PIECES_INIT_STATE[piece];
    const rotation = '1';
    return { piece, position, state, rotation, initState: state };
  }
}
