import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// Define a type for the experience data
interface Experience {
  title: string;
  company: string;
  companyLink: string;
  timeframe: string;
  location: string;
  description: string;
  technologies: string[];
  isCurrent: boolean;
}


@Component({
  selector: 'app-experiencia',
  imports: [CommonModule],
  templateUrl: './experiencia.component.html',
  styleUrl: './experiencia.component.scss'
})
export class ExperienciaComponent implements OnInit {

  // Data for the professional experience timeline
  public experiences: Experience[] = [
    {
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Solutions',
      companyLink: '#',
      timeframe: '2022 - Presente',
      location: 'Madrid, España',
      description: 'Lidero el desarrollo de aplicaciones web escalables utilizando React, Node.js y AWS. Mentorizo a desarrolladores junior y colaboro en la arquitectura de los sistemas.',
      technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
      isCurrent: true
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      companyLink: '#',
      timeframe: '2020 - 2022',
      location: 'Barcelona, España',
      description: 'Desarrollé desde cero una plataforma SaaS para gestión de proyectos. Implementé funcionalidades de tiempo real y optimicé el rendimiento de la aplicación.',
      technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Socket.io', 'Redis'],
      isCurrent: false
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Agency Pro',
      companyLink: '#',
      timeframe: '2019 - 2020',
      location: 'Valencia, España',
      description: 'Creé interfaces de usuario responsivas y accesibles para diversos clientes. Colaboré estrechamente con diseñadores UX/UI para implementar experiencias excepcionales.',
      technologies: ['React', 'TypeScript', 'Sass', 'Webpack', 'Jest'],
      isCurrent: false
    },
    {
      title: 'Junior Web Developer',
      company: 'WebStudio Creative',
      companyLink: '#',
      timeframe: '2018 - 2019',
      location: 'Sevilla, España',
      description: 'Comencé mi carrera desarrollando sitios web corporativos y tiendas online. Aprendí las bases del desarrollo web y las mejores prácticas de la industria.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      isCurrent: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}