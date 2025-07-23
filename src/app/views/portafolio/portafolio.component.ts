import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PortadaComponent } from '../../shared/components/portada/portada.component';
import { SidebarMenuComponent } from '../../core/components/sidebar-menu/sidebar-menu.component';
import { BackgroundAudioComponent } from '../../core/components/background-audio/background-audio.component';
import { LayoutService } from '../../core/services/layout-service';
import { AboutComponent } from '../../shared/components/about/about.component';
import { ExperienceComponent } from '../../shared/components/experience/experience.component';
import { ProjectsComponent } from '../../shared/components/projects/projects.component';
import { SkillsComponent } from '../../shared/components/skills/skills.component';
import { EducationComponent } from '../../shared/components/education/education.component';
import { ExtracurricularComponent } from '../../shared/components/extracurricular/extracurricular.component';
import { ContactComponent } from '../../shared/components/contact/contact.component';

const COMPONENTS = [
  PortadaComponent,
  SidebarMenuComponent,
  BackgroundAudioComponent,
  AboutComponent,
  ExperienceComponent,
  ProjectsComponent,
  SkillsComponent,
  EducationComponent,
  ExtracurricularComponent,
  ContactComponent
] 

@Component({
  selector: 'app-portafolio',
  imports: [CommonModule, ...COMPONENTS],
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.scss'
})
export class PortafolioComponent {
  layoutService = inject(LayoutService); 
}
