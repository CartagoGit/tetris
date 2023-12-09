import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateService } from '../../shared/services/state.service';

@Component({
  selector: 'app-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioComponent {
  constructor(public stateSvc: StateService){}

}
