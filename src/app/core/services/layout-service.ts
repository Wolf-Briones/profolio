// layout.service.ts
import { Injectable, signal, computed } from '@angular/core'; 
import { LayoutState } from '../../shared/enums/layout-state';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private currentState = signal<LayoutState>(LayoutState.FrontPage);

  // Setter
  setState(state: LayoutState) {
    this.currentState.set(state);
  }

  // Getter
  getState = computed(() => this.currentState());

  // Métodos booleanos para usar en plantillas
  isFrontPage = computed(() => this.currentState() === LayoutState.FrontPage);
  isAbout = computed(() => this.currentState() === LayoutState.About);
  isExperience = computed(() => this.currentState() === LayoutState.Experience);
  isProjects = computed(() => this.currentState() === LayoutState.Projects);
  isSkills = computed(() => this.currentState() === LayoutState.Skills);
  isEducation = computed(() => this.currentState() === LayoutState.Education);
  isExtracurricular = computed(() => this.currentState() === LayoutState.Extracurricular);
  isContact = computed(() => this.currentState() === LayoutState.Contact);
}
