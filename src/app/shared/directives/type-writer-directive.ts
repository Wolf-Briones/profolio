// typewriter.directive.ts
import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTypewriter]'
})
export class TypewriterDirective implements OnInit, OnChanges, OnDestroy {
  /** Texto a tipear */
  @Input('appTypewriter') text: string = '';
  /** Velocidad por carácter (ms) */
  @Input() speed = 35;
  /** Retraso inicial antes de empezar (ms) */
  @Input() delay = 0;
  /** Repetir animación */
  @Input() loop = false;
  /** Pausa antes de reiniciar si loop=true (ms) */
  @Input() loopPause = 800;

  private idx = 0;
  private timer: any;

  constructor(private el: ElementRef<HTMLElement>, private rd: Renderer2) {}

  ngOnInit(): void {
    this.setup();
    this.start();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && !changes['text'].firstChange) {
      this.reset();
      this.start();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  private setup() {
    // Clase para el caret (SCSS abajo)
    this.rd.addClass(this.el.nativeElement, 'typing-caret');
    // Limpia contenido
    this.rd.setProperty(this.el.nativeElement, 'textContent', '');
  }

  private reset() {
    clearTimeout(this.timer);
    this.idx = 0;
    this.rd.setProperty(this.el.nativeElement, 'textContent', '');
  }

  private start() {
    const run = () => {
      if (!this.text) return;
      if (this.idx <= this.text.length) {
        this.rd.setProperty(this.el.nativeElement, 'textContent', this.text.slice(0, this.idx));
        this.idx++;
        this.timer = setTimeout(run, this.speed);
      } else if (this.loop) {
        // Pequeña pausa y reinicia
        this.timer = setTimeout(() => {
          this.idx = 0;
          this.rd.setProperty(this.el.nativeElement, 'textContent', '');
          run();
        }, this.loopPause);
      }
    };

    if (this.delay > 0) {
      this.timer = setTimeout(run, this.delay);
    } else {
      run();
    }
  }
}
