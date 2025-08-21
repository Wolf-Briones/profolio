import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-buttons',
  imports: [],
  templateUrl: './navigation-buttons.component.html',
  styleUrl: './navigation-buttons.component.scss'
})
export class NavigationButtonsComponent {

  /**
   * Navega a la página anterior en el historial del navegador.
   * Esto funciona para rutas internas y externas.
   */
  goBack(): void {
    window.history.back();
  }

  /**
   * Navega a la página siguiente en el historial del navegador.
   * Útil si el usuario ha presionado "atrás" antes.
   */
  goForward(): void {
    window.history.forward();
  }

}
