import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { AsideComponent } from '../../components/aside/aside.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TableComponent, AsideComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  public title = "Cartago's Tetris";
}
