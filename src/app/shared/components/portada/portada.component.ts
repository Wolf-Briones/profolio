import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-portada',
  imports: [CommonModule],
  templateUrl: './portada.component.html',
  styleUrl: './portada.component.scss'
})
export class PortadaComponent {
  myPortfolio: any = {
    name: 'Franki Briones',
    role: 'Desarrollador Backend & Frontend',
    description: 'A portfolio showcasing my projects and skills.',
    imageUrl: 'https://avatars.githubusercontent.com/u/61076196?v=4',
    urlsProfile: {
      github: 'https://github.com/franki-wolf1',
      stackoverflow: 'https://www.linkedin.com/in/franki-briones/',
      linkedin: 'https://www.linkedin.com/in/franki-briones/',
      twitter: '',  
      instagram: 'https://www.instagram.com/frankibriones/',
      youtube: '',
      facebook: '',
      whatsapp: '',
      telegram: '',
      email: ''}
  }

}
