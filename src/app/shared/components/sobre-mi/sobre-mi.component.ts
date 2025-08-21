import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../service/language-service';
import { CONFIG_ABOUT_ME, Languages, PROFILE_CONSTANTS, Skills, TECH_STACK } from '../../service/data-profile-language';
import { TypewriterDirective } from '../../directives/type-writer-directive';
import { CommonModule } from '@angular/common';  
import { ArcadeGameScreenComponent } from '../../games-comp/arcade-game-screen/arcade-game-screen.component';
import { NavigationButtonsComponent } from '../../../core/components/navigation-buttons/navigation-buttons.component';

@Component({
  selector: 'app-sobre-mi',
  imports: [ CommonModule, TypewriterDirective, ArcadeGameScreenComponent, NavigationButtonsComponent],
  templateUrl: './sobre-mi.component.html',
  styleUrl: './sobre-mi.component.scss'
})
export class SobreMiComponent {

  stateGame = signal<string>('intro');

  currentLang = signal<Languages>(Languages.ES);
  // Configuración actual, calculada a partir del idioma
  _INFO_TITLE = computed(() => PROFILE_CONSTANTS.BASIC_INFO.TITLE[this.currentLang()]);
  _INFO_LOCATION = computed(() => PROFILE_CONSTANTS.BASIC_INFO.LOCATION[this.currentLang()]); 
  _INFO_ABOUT = computed(() => CONFIG_ABOUT_ME[this.currentLang()]);

  selectedLanguage: string = '';

  private languageService = inject(LanguageService);

  public techSkills: Skills = TECH_STACK;
  public categories = Object.keys(TECH_STACK) as (keyof Skills)[];
  /* public categories = Object.values(SkillCategory); */

  codeLines = [
    '// Microservicio para enviar mensajes a la NASA',
    '// Protocolo: Interplanetary File System (IPFS) mejorado',
    'import org.springframework.boot.SpringApplication;',
    'import org.springframework.boot.autoconfigure.SpringBootApplication;',
    'import org.springframework.web.bind.annotation.PostMapping;',
    'import org.springframework.web.bind.annotation.RequestBody;',
    'import org.springframework.web.bind.annotation.RestController;',
    '',
    '@SpringBootApplication',
    'public class NasaMessagingService {',
    '',
    '    public static void main(String[] args) {',
    '        SpringApplication.run(NasaMessagingService.class, args);',
    '    }',
    '}',
    '',
    '@RestController',
    'class MessageController {',
    '',
    '    @PostMapping("/api/send-message-to-nasa")',
    '    public String sendMessage(@RequestBody String message) {',
    '        // Lógica simulada para enviar el mensaje',
    '        System.out.println("Mensaje recibido para la NASA: " + message);',
    '        ',
    '        // Simulación de envío a un endpoint seguro de la NASA',
    '        String status = sendToNasaEndpoint(message);',
    '        ',
    '        return "Mensaje enviado a la NASA. Estado: " + status;',
    '    }',
    '',
    '    private String sendToNasaEndpoint(String message) {',
    '        // Aquí iría la lógica real, como una llamada a una API de la NASA',
    '        // return apiService.send(message);',
    '        return "Success";',
    '    }',
    '}',
  ];

  displayedLines: string[] = [];
  private lineIndex = 0;
  private interval: any;

  constructor(private router: Router) {
    this.selectedLanguage = this.languageService.getCurrentLanguage(); 
    this.currentLang.set(this.selectedLanguage as Languages);
  }

  ngOnInit(): void {
    this.startTyping();
    // Llama a esta función cuando el componente se inicialice para aplicar la animación
    this.applyTypingAnimation();
    console.log('Habilidades de Frontend:', this.techSkills.Frontend);
    console.log('Categorías disponibles:', this.categories);
  }

  private applyTypingAnimation(): void { 
  }

  public changeStateGame(state: string): void { 
    this.stateGame.set(state); 
  } 
  
  goToGames() {
      this.router.navigate(['/projects']); 
  }
  
  goBack() {
      this.router.navigate(['/intro']); 
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startTyping() {
    this.interval = setInterval(() => {
      if (this.lineIndex < this.codeLines.length) {
        this.displayedLines.push(this.codeLines[this.lineIndex]);
        this.lineIndex++;
      } else {
        clearInterval(this.interval);
      }
    }, 250); // Ajusta la velocidad de escritura (en milisegundos)
  }
}
