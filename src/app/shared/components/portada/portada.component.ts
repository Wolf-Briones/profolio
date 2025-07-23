import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { configFrankiBriones } from '../../const/config-fillstack';
import { BackgroundVideoComponent } from '../../../core/components/background-video/background-video.component';

@Component({
  selector: 'app-portada',
  imports: [CommonModule, BackgroundVideoComponent],
  templateUrl: './portada.component.html',
  styleUrl: './portada.component.scss'
})
export class PortadaComponent {
  myPortfolio: any = configFrankiBriones;  
}
