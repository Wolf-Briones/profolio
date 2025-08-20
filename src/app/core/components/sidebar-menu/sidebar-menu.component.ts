import { Component, inject, signal } from '@angular/core';
import { LayoutService } from '../../services/layout-service';
import { LayoutState } from '../../../shared/enums/layout-state';

@Component({
  selector: 'app-sidebar-menu',
  imports: [],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {
  layoutService = inject(LayoutService);
  // Signal para controlar el estado del menú
  isMenuOpen = signal<boolean>(true);

  toggleSidebar(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeSidebar(): void {
    this.isMenuOpen.set(false);
  }

  openSidebar(): void {
    this.isMenuOpen.set(true);
  }

  state = LayoutState;
  navigateToSection(section: LayoutState): void {
    // Aquí puedes implementar la lógica de navegación
    console.log(`Navigating to section: ${section}`);
    this.layoutService.setState(section)
    
    // Ejemplo de scroll suave a la sección
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Cerrar el menú después de navegar (especialmente útil en móvil)
    this.closeSidebar();
  }
}