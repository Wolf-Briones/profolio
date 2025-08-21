import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CONFIG_PROJECTS, Languages, PROJECTS_DATA } from '../../service/data-profile-language';
import { LanguageService } from '../../service/language-service'; 
import { NavigationButtonsComponent } from '../../../core/components/navigation-buttons/navigation-buttons.component';

@Component({
  selector: 'app-proyectos',
  imports: [CommonModule, NavigationButtonsComponent],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.scss'
})
export class ProyectosComponent  implements OnInit {
 
  currentLang = signal<Languages>(Languages.ES);

  private languageService = inject(LanguageService);

  _PROJECTS_DATA = computed(() => PROJECTS_DATA[this.currentLang()]);
  _CONFIG_PROJECTS = computed(() => CONFIG_PROJECTS[this.currentLang()]);

  constructor(private router: Router) {
    const selectedLanguage = this.languageService.getCurrentLanguage(); 
    this.currentLang.set(selectedLanguage as Languages);
    
  }

  ngOnInit(): void {
  }

  mostrarSignal (): void { 
    console.log(this._CONFIG_PROJECTS());
  } 
  
  oppenNewWindowpage(link: string) {  
    // Abre el enlace en una nueva pestaña para iniciar la descarga.
    window.open(link, '_blank');
  }
  
  goToGames() {
      this.router.navigate(['/experience']); 
  }
  
  goBack() {
      this.router.navigate(['/about']); 
  }
}