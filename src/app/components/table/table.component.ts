import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Piece } from '../../shared/models/piece.model';
import { StateService } from '../../shared/services/state.service';
import { Subscription } from 'rxjs';
import { TableFillSpace } from '../../shared/interfaces/piece.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  // ANCHOR  : Properties
  public rows = 20;
  public columns = 10;
  public table: TableFillSpace[][] = this._createNewTable();

  private subscriptions: Subscription[] = [];

  // ANCHOR  : Constructor
  constructor(public stateSvc: StateService) {
    this._createSubscriptions();

    // Check new Pieces
    const pieces = [];
    for (let i = 0; i < 50; i++) {
      pieces.push(new Piece());
    }
    console.log(pieces, this.table);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => !sub.closed && sub.unsubscribe());
  }

  // ANCHOR  : Methods

  private _createSubscriptions(): void {
    const subGameStart = this.stateSvc.gameStart$.subscribe((gameStart) => {
      if (!gameStart) return;
      this.table = this._createNewTable();
    });
    this.subscriptions.push(subGameStart);
  }

  private _createNewTable(): TableFillSpace[][] {
    return new Array(this.rows).fill(
      new Array<TableFillSpace>(this.columns).fill('x')
    );
  }
}
