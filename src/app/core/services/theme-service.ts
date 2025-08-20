// src/app/shared/service/theme.service.ts
import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'nightvision';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme = signal<Theme>('light');

  constructor() {
    // Inicializar con el tema guardado en localStorage (si existe)
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }
  }

  get theme() {
    return this.currentTheme.asReadonly();
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
