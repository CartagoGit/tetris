export type TypePiece = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type TableFillSpace = 'x' | TypePiece;

export interface Position {
  x: number;
  y: number;
}

export interface PieceProps {
  piece: TypePiece;
  position: Position;
  state: TableFillSpace[][];
  rotation: '1' | '2' | '3' | '4';
}

export type Color =
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'white'
  | 'black'
  | 'transparent';
