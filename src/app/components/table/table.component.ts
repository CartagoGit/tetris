import { PIECES_COLOR } from './../../shared/models/piece.model';
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
    event.preventDefault();
    if (!(possibleKeys as string[]).includes(code)) return;
    const key = code as Keys;
    if (key === 'KeyS') {
      console.log('KeyS');
      this.stateSvc.audioOn$.next(!this.stateSvc.audioOn$.value);
    }

    // Aquí puedes manejar el evento de teclado
    console.log('Tecla presionada:', code);
  }

  // ANCHOR : Properties
  public rows = 20;
  public columns = 10;
  public table: TableFillSpace[][] = this._createNewTable();
  public savedTable = this.table;
  public PIECES_COLOR = PIECES_COLOR;

  private subscriptions: Subscription[] = [];

  // ANCHOR : Constructor
  constructor(public stateSvc: StateService, private _cd: ChangeDetectorRef) {
    this._createSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => !sub.closed && sub.unsubscribe());
  }

  // ANCHOR : Methods

  private _createSubscriptions(): void {
    const subGameStart = this.stateSvc.gameStart$.subscribe((gameStart) => {
      console.log({ gameStart });
      if (!gameStart) return;
      this._newGame();
    });
    const subCurrentPiece = this.stateSvc.currentPiece$.subscribe(() => {
      this._paintPiece();
    });
    this.subscriptions.push(subGameStart, subCurrentPiece);
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

  private _paintPiece(): void {
    const currentPiece = this.stateSvc.currentPiece$.value;
    if (!currentPiece) return;
    const beforeTable = this.table.map((row) => [...row]);
    this.table = this.savedTable.map((row) => [...row]);
    const { state, position: pos, piece: typePiece } = currentPiece;
    for (let pieceRow = 0; pieceRow < state.length; pieceRow++) {
      const tableRowIndex = pos.y + pieceRow;
      if (tableRowIndex < 0) continue;
      if (tableRowIndex >= this.table.length) {
        this.stateSvc.gameOver$.next(true);
        break;
      }
      outerLoop: for (
        let pieceCell = 0;
        pieceCell < state[pieceRow].length;
        pieceCell++
      ) {
        const tableCellIndex = pos.x + pieceCell;
        if (state[pieceRow][pieceCell] === 'x') continue;
        const actualTableCellPiece = this.table[tableRowIndex][tableCellIndex];
        if (actualTableCellPiece !== 'x') {
          this.stateSvc.gameOver$.next(true);
          break outerLoop;
        }
        this.table[tableRowIndex][tableCellIndex] = typePiece;
      }
    }
    if (this.stateSvc.gameOver$.value)
      this.table = beforeTable.map((row) => [...row]);
    this._cd.detectChanges();
  }
}
