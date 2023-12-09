import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Piece } from '../../shared/models/piece.model';
import { StateService } from '../../shared/services/state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  public rows = 20;
  public columns = 10;
  public table = new Array(this.rows).fill(new Array(this.columns).fill(0));

  private subscriptions: Subscription[] = [];

  constructor(public stateSvc: StateService) {
    this._createSubscriptions();
    const piece = new Piece();
    console.log(piece);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => !sub.closed && sub.unsubscribe());
  }

  // ANCHOR  : Methods

  private _createSubscriptions(): void {
    const subGameStart = this.stateSvc.gameStart$.subscribe((gameStart) => {
      if (!gameStart) return;
      this._createTable();
    });
    this.subscriptions.push(subGameStart);
  }

  private _createTable(): void {
    this.table = new Array(this.rows).fill(new Array(this.columns).fill(0));
  }
}
