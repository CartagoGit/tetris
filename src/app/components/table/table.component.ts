import {
  PIECES_COLOR,
  PIECES_INTENSE,
} from './../../shared/models/piece.model';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
} from '@angular/core';
import { Piece } from '../../shared/models/piece.model';
import { StateService } from '../../shared/services/state.service';
import { Subscription } from 'rxjs';
import { TableFillSpace } from '../../shared/interfaces/piece.interface';
import { Keys } from '../../shared/interfaces/keys.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  // ANCHOR : Listeners
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const { code } = event;
    const possibleKeys: Keys[] = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
      'Space',
      'KeyS',
    ];

    if (!(possibleKeys as string[]).includes(code)) return;
    const key = code as Keys;
    if (key === 'KeyS') {
      this.stateSvc.audioOn$.next(!this.stateSvc.audioOn$.value);
      return;
    }
    if (this.stateSvc.isPaused$.value || this.stateSvc.gameOver$.value) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(key)) {
      const currentPiece = this.stateSvc.currentPiece$.value;
      if (!currentPiece) return;
      const pieceCloned = currentPiece.clonePiece();
      const { position } = currentPiece;
      let { x: posX, y: posY } = position;
      const { state } = currentPiece;
      if (key === 'ArrowLeft') {
        posX--;
        pieceCloned.position.x = posX;
        const isCollision = this._checkColisions(pieceCloned);
        if (posX < 0 || isCollision) return;
      } else if (key === 'ArrowRight') {
        posX++;
        const limitRight = state[0].length - 1 + posX;
        pieceCloned.position.x = posX;
        const isCollision = this._checkColisions(pieceCloned);
        if (limitRight > this.columns - 1 || isCollision) return;
      } else if (key === 'ArrowDown') {
        posY++;
        const limitDown = state.length - 1 + posY;
        if (limitDown > this.rows - 1) {
          this._clearLines();
          this._createNewPiece();
          return;
        }
      } else if (key === 'ArrowUp') {
        if (currentPiece.type === 'O') return;
        pieceCloned.rotate();
        const isCollision = this._checkColisions(pieceCloned);
        if (isCollision) return;
        this.stateSvc.currentPiece$.next(pieceCloned);
        return;
      }
      const newPosition = { x: posX, y: posY };
      currentPiece.position = newPosition;
      this.stateSvc.currentPiece$.next(currentPiece);
    }
  }

  // ANCHOR : Properties
  public rows = 20;
  public columns = 10;
  public table: TableFillSpace[][] = this._createNewTable();
  public savedTable = this.table;
  public PIECES_COLOR = PIECES_COLOR;
  public PIECES_INTENSE = PIECES_INTENSE;

  private subscriptions: Subscription[] = [];

  // ANCHOR : Constructor
  constructor(public stateSvc: StateService, private _cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._createSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => !sub.closed && sub.unsubscribe());
  }

  // ANCHOR : Methods

  private _createSubscriptions(): void {
    const subGameStart = this.stateSvc.gameStart$.subscribe((gameStart) => {
      if (!gameStart) return;
      this._newGame();
    });
    const subCurrentPiece = this.stateSvc.currentPiece$.subscribe((piece) => {
      if (!piece) return;
      const isCollision = this._checkColisions(piece);

      if (isCollision) {
        if (this._clearLines()) return;
        if (piece.position.y <= 0) {
          piece.position.y = piece.position.y - 1;
          this._paintPiece(piece);
          this.stateSvc.gameOver$.next(true);
          this._cd.detectChanges();
          return;
        }
        this._createNewPiece();
        this._cd.detectChanges();
        return;
      }
      this._paintPiece();
      this._cd.detectChanges();
    });
    const subCleanTable = this.stateSvc.cleanTable$.subscribe(() => {
      this._createNewTable();
      this._cd.detectChanges();
    });
    this.subscriptions.push(subGameStart, subCurrentPiece, subCleanTable);
  }

  private _newGame(): void {
    this._createNewTable();
    this._createNewPiece();
  }

  private _createNewTable(): TableFillSpace[][] {
    const newTable = () =>
      Array.from({ length: this.rows }, () => [
        ...new Array<TableFillSpace>(this.columns).fill('x'),
      ]);
    this.table = newTable();
    this.savedTable = newTable();
    return this.table;
  }

  private _createNewPiece(): void {
    this.savedTable = this.table.map((row) => [...row]);
    this.stateSvc.currentPiece$.next(this.stateSvc.nextPiece$.value);
    this.stateSvc.nextPiece$.next(new Piece());
  }

  private _paintPiece(finalPiece?: Piece): void {
    const currentPiece = finalPiece ?? this.stateSvc.currentPiece$.value;
    if (!currentPiece) return;
    this.table = this.savedTable.map((row) => [...row]);
    const { state, position: pos, type: typePiece } = currentPiece;
    for (let pieceRow = 0; pieceRow < state.length; pieceRow++) {
      const tableRowIndex = pos.y + pieceRow;
      if (tableRowIndex < 0) continue;
      for (let pieceCell = 0; pieceCell < state[pieceRow].length; pieceCell++) {
        const tableCellIndex = pos.x + pieceCell;
        if (state[pieceRow][pieceCell] === 'x') continue;
        this.table[tableRowIndex][tableCellIndex] = typePiece;
      }
    }
  }

  private _checkColisions(piece: Piece): boolean {
    const { position: pos, state } = piece;
    const { x: posX, y: posY } = pos;
    const limitDown = state.length - 1 + posY;
    if (limitDown > this.rows - 1) return true;

    for (let pieceRow = 0; pieceRow < state.length; pieceRow++) {
      const tableRowIndex = posY + pieceRow;
      if (tableRowIndex < 0) continue;
      for (let pieceCell = 0; pieceCell < state[pieceRow].length; pieceCell++) {
        const tableCellIndex = posX + pieceCell;
        if (state[pieceRow][pieceCell] === 'x') continue;
        const actualTableCellPiece =
          this.savedTable[tableRowIndex][tableCellIndex];
        if (actualTableCellPiece !== 'x') {
          return true;
        }
      }
    }
    return false;
  }

  private _clearLines(): boolean {
    const needClear = this.table.some((row) =>
      row.every((cell) => cell !== 'x')
    );
    if (!needClear) return needClear;
    let clearedLines = 0;
    for (let row = 0; row < this.table.length; row++) {
      const isLineToClear = this.table[row].every((cell) => cell !== 'x');
      if (!isLineToClear) continue;
      this.table.splice(row, 1);
      this.table.unshift(new Array(this.columns).fill('x'));
      clearedLines++;
    }
    this.stateSvc.score += 100 * this.stateSvc.level$.value * clearedLines ** 2;

    this.stateSvc.lines += clearedLines;
    const level = Math.floor(this.stateSvc.lines / 10) + 1;
    if (this.stateSvc.level$.value !== level) this.stateSvc.level$.next(level);

    this._cd.detectChanges();
    return needClear;
  }
}
