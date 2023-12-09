import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AudioComponent } from './components/audio/audio.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AudioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
