import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateService } from '../../shared/services/state.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideComponent {
  public isPaused = true;

  constructor(public stateSvc: StateService) {}
}
