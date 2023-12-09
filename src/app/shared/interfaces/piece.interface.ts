export type Piece = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type TableFillSpace = 'none' | Piece;

export interface Position {
  x: number;
  y: number;
}
