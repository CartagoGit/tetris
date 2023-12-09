export type TypePiece = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type TableFillSpace = 'x' | TypePiece;

export interface Position {
  x: number;
  y: number;
}

export interface PieceProps {
  piece: TypePiece;
  position: Position;
  initState: TableFillSpace[][];
  state: TableFillSpace[][];
  rotation: '1' | '2' | '3' | '4';
}

