import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, signal, effect, ElementRef, ViewChild, OnDestroy, EffectRef, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-background-audio',
  imports: [CommonModule],
  templateUrl: './background-audio.component.html',
  styleUrl: './background-audio.component.scss'
})
export class BackgroundAudioComponent implements OnDestroy {
  @ViewChild('audioPlayer', { static: true }) audioPlayer!: ElementRef<HTMLAudioElement>;

  // Signals para el estado del componente
  isPlaying = signal(true);
  isLoading = signal(false);
  hasError = signal(false);
  volume = signal(0.5);
  audioSrc = signal('/assets/audio/Spandex-Man The Animated Series - Rod Kim.mp3'); // Cambia por tu ruta de audio
  errorMessage = signal('');
  showVolumeControl = signal(true);

  // Referencias a los effects para limpiarlos
  private effectRefs: EffectRef[] = [];

  // Referencia matemática para el template
  Math = Math;

  // Verificar si estamos en el navegador
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Solo crear effects si estamos en el navegador
    if (this.isBrowser) {
      // Effect para controlar la reproducción
      this.effectRefs.push(
        effect(() => {
          if (this.audioPlayer?.nativeElement) {
            const audio = this.audioPlayer.nativeElement;
            if (this.isPlaying()) {
              this.playAudio();
            } else {
              this.pauseAudio();
            }
          }
        })
      );

      // Effect para controlar el volumen
      this.effectRefs.push(
        effect(() => {
          if (this.audioPlayer?.nativeElement) {
            this.audioPlayer.nativeElement.volume = this.volume();
          }
        })
      );

      // Effect para manejar cambios en la fuente de audio
      this.effectRefs.push(
        effect(() => {
          if (this.audioPlayer?.nativeElement) {
            const audio = this.audioPlayer.nativeElement;
            const wasPlaying = this.isPlaying();
            
            this.pauseAudio();
            this.hasError.set(false);
            this.isLoading.set(true);
            
            audio.src = this.audioSrc();
            audio.load();
            
            if (wasPlaying) {
              audio.addEventListener('canplay', () => {
                this.playAudio();
              }, { once: true });
            }
          }
        })
      );
    }
  }

  ngOnDestroy() {
    // Limpiar effects
    this.effectRefs.forEach(effectRef => effectRef.destroy());
    
    // Pausar audio al destruir el componente (solo en navegador)
    if (this.isBrowser && this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.pause();
    }
  }

  toggleAudio() {
    if (this.hasError() || this.isLoading() || !this.isBrowser) return;
    
    this.isPlaying.update(playing => !playing);
  }

  private async playAudio() {
    if (!this.isBrowser || !this.audioPlayer?.nativeElement) return;

    try {
      this.isLoading.set(true);
      await this.audioPlayer.nativeElement.play();
      this.hasError.set(false);
      this.errorMessage.set('');
    } catch (error) {
      console.error('Error reproduciendo audio:', error);
      this.handleAudioError(error);
      this.isPlaying.set(false);
    } finally {
      this.isLoading.set(false);
    }
  }

  private pauseAudio() {
    if (!this.isBrowser || !this.audioPlayer?.nativeElement) return;
    
    this.audioPlayer.nativeElement.pause();
    this.isLoading.set(false);
  }

  onCanPlay() {
    if (!this.isBrowser) return;
    
    this.isLoading.set(false);
    this.hasError.set(false);
    this.errorMessage.set('');
  }

  onError(event: any) {
    if (!this.isBrowser) return;
    
    console.error('Error en el audio:', event);
    this.handleAudioError('No se pudo cargar el archivo de audio');
  }

  private handleAudioError(error: any) {
    this.hasError.set(true);
    this.isPlaying.set(false);
    this.isLoading.set(false);
    
    if (typeof error === 'string') {
      this.errorMessage.set(error);
    } else if (error?.message) {
      this.errorMessage.set(error.message);
    } else {
      this.errorMessage.set('Error reproduciendo audio');
    }
  }

  setVolume(event: Event) {
    if (!this.isBrowser) return;
    
    const target = event.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    this.volume.set(newVolume);
  }

  // Métodos para la UI
  getIcon(): string {
    if (this.isLoading()) {
      return 'bi-hourglass-split';
    } else if (this.hasError()) {
      return 'bi-bug';
    } else if (this.isPlaying()) {
      return 'bi-pause-btn-fill';
    } else {
      return 'bi-play-btn-fill';
    }
  }

  getStatusText(): string {
    if (this.isLoading()) {
      return 'Cargando...';
    } else if (this.hasError()) {
      return 'Error';
    } else if (this.isPlaying()) {
      return 'Pausar';
    } else {
      return 'Reproducir';
    }
  }

  getButtonTitle(): string {
    if (this.isLoading()) {
      return 'Cargando audio...';
    } else if (this.hasError()) {
      return 'Error al cargar audio';
    } else if (this.isPlaying()) {
      return 'Pausar música de fondo';
    } else {
      return 'Reproducir música de fondo';
    }
  }

  // Métodos públicos para controlar desde el componente padre
  setAudioSource(src: string) {
    this.audioSrc.set(src);
  }

  setVolumeLevel(level: number) {
    const clampedLevel = Math.max(0, Math.min(1, level));
    this.volume.set(clampedLevel);
  }

  toggleVolumeControl() {
    this.showVolumeControl.update(show => !show);
  }

  // Getters para acceder a los signals desde el padre
  get isAudioPlaying() {
    return this.isPlaying();
  }

  get currentVolume() {
    return this.volume();
  }

  get audioHasError() {
    return this.hasError();
  }
}