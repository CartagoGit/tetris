import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { AsideComponent } from '../../components/aside/aside.component';
import { StateService } from '../../shared/services/state.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [TableComponent, AsideComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  public title = "Cartago's Tetris";

  constructor(public stateSvc: StateService) {}
}
