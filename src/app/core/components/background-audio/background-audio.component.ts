import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  signal,
  effect,
  ElementRef,
  ViewChild,
  OnDestroy,
  EffectRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

@Component({
  selector: 'app-background-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background-audio.component.html',
  styleUrl: './background-audio.component.scss'
})
export class BackgroundAudioComponent implements OnDestroy {
  @ViewChild('audioPlayer', { static: true }) audioPlayer!: ElementRef<HTMLAudioElement>;

  isPlaying = signal(false); // Ahora inicia en falso, no reproduce automáticamente
  isLoading = signal(false);
  hasError = signal(false);
  volume = signal(0.5);
  audioSrc = signal('/assets/audio/Spandex-Man The Animated Series - Rod Kim.mp3');
  errorMessage = signal('');
  showVolumeControl = signal(true);

  private effectRefs: EffectRef[] = [];
  private isBrowser: boolean;
  Math = Math;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Solo pausar automáticamente si el estado cambia a "no reproduciendo"
      this.effectRefs.push(
        effect(() => {
          if (this.audioPlayer?.nativeElement && !this.isPlaying()) {
            this.pauseAudio();
          }
        })
      );

      this.effectRefs.push(
        effect(() => {
          if (this.audioPlayer?.nativeElement) {
            this.audioPlayer.nativeElement.volume = this.volume();
          }
        })
      );

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
    this.effectRefs.forEach(effectRef => effectRef.destroy());
    if (this.isBrowser && this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.pause();
    }
  }

  toggleAudio() {
    if (this.hasError() || this.isLoading() || !this.isBrowser) return;

    const shouldPlay = !this.isPlaying();
    this.isPlaying.set(shouldPlay);

    if (shouldPlay) {
      this.playAudio(); // Solo se llama después de la interacción del usuario
    } else {
      this.pauseAudio();
    }
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

  // Métodos para UI
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

  // Métodos públicos
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

  // Getters públicos
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
