import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  public rows = 20;
  public columns = 10;
  public table = new Array(this.rows).fill(new Array(this.columns).fill(0));
}
