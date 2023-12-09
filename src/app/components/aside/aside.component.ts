import { PIECES_COLOR } from './../../shared/models/piece.model';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateService } from '../../shared/services/state.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideComponent {
  public PIECES_COLOR = PIECES_COLOR;
  public isPaused = true;

  constructor(public stateSvc: StateService) {}
}
