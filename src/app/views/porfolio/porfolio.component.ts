import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../shared/service/language-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CONFIGURACIONES, LanguageNames, Languages,  } from '../../shared/service/data-profile-language';
import { Theme, ThemeService } from '../../core/services/theme-service';

@Component({
  selector: 'app-porfolio',
  imports: [CommonModule, FormsModule],
  templateUrl: './porfolio.component.html',
  styleUrls: ['./porfolio.component.scss'],
})
export class PorfolioComponent {

  phoneNumber: string = '+51945965393'; // Número de teléfono para llamadas
  // Idioma actual (ejemplo: español)
  currentLang = signal<Languages>(Languages.ES);  
  selectedLanguage: string = '';
  selectedTheme: Theme = 'light';

  // Lista de idiomas con etiquetas en el idioma actual
  languages = computed(() =>
    Object.keys(LanguageNames).map((key) => {
      const lang = key as Languages;
      return {
        key: lang,
        label: LanguageNames[this.currentLang() as Languages][lang], // 👈 toma el nombre según el idioma actual
      };
    })
  );

  // Configuración actual, calculada a partir del idioma
  configuracionActual = computed(() => CONFIGURACIONES[this.currentLang()]);

  private languageService = inject(LanguageService);

  constructor(private themeService: ThemeService) {
    this.selectedTheme = this.themeService.theme();
    this.selectedLanguage = this.languageService.getCurrentLanguage(); // ← idioma inicial
  }

  changeTheme() {
    this.themeService.setTheme(this.selectedTheme); 
  }

  changeLanguage() {
    this.languageService.setLanguage(this.selectedLanguage as Languages);
    this.currentLang.set(this.languageService.getCurrentLanguage()); 
  } 
  
  openlinkedin() {
    const cvUrl = 'https://www.linkedin.com/in/franki-briones';
    window.open(cvUrl, '_blank');
  }

  openStackOverflow() {
    const stackOverflowUrl = 'https://stackoverflow.com/users/23255453/franki-briones';
    window.open(stackOverflowUrl, '_blank');
  }

  openGitHub() {
    const githubUrl = 'https://github.com/franki-wolf1';
    window.open(githubUrl, '_blank');
  }
  
  openInstagram() {
    const instagramUrl = 'https://www.instagram.com/frankibriones';
    window.open(instagramUrl, '_blank');
  }

  makeCall() {
    window.location.href = `tel:${this.phoneNumber}`;
  }
  
  /**
   * Método para descargar el CV desde un enlace de Google Drive.
   * Abre la URL de descarga en una nueva pestaña.
   */
  downloadCV() {
    // IMPORTANTE: Reemplaza 'TU_ID_DEL_ARCHIVO' con el ID real de tu CV en Google Drive.
    // Asegúrate de que el enlace tenga el formato de descarga directa.
    const cvUrl = 'https://drive.google.com/file/d/1S-zaMei8qy3D5QK8pbxCH16QsSkPtVWa/view?usp=sharing';
    
    // Abre el enlace en una nueva pestaña para iniciar la descarga.
    window.open(cvUrl, '_blank');
  }

}
