import { Component } from '@angular/core';
import { BackgroundVideoComponent } from '../../../core/components/background-video/background-video.component';
import { CommonModule } from '@angular/common';
import { configFrankiBriones } from '../../const/config-fillstack';

export interface Feature {
  id: string;
  title: string;
  description: string;
  position: string;
}

@Component({
  selector: 'app-about',
  imports: [CommonModule, BackgroundVideoComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  aboutMe = configFrankiBriones;

  values = ['integrity', 'respect', 'teamwork', 'excellence'];

  // Método trackBy para el componente
  trackByFn(index: number, item: Feature): string {
    return item.id;
  }
}
