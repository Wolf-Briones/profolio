import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as Tone from 'tone';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rapidFire' | 'shield' | 'multiShot' | 'scoreBonus';
  speedY: number;
}

interface TouchButton {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  action: string;
  isPressed: boolean;
}

@Component({
  selector: 'app-arcade-game-screen',
  imports: [],
  templateUrl: './arcade-game-screen.component.html',
  styleUrl: './arcade-game-screen.component.scss'
})
export class ArcadeGameScreenComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private toneJsLoaded: boolean = false;

  // Constantes del juego
  private readonly PLAYER_SPEED = 5;
  private readonly BULLET_SPEED = 7;
  private readonly SHOOT_COOLDOWN = 300; // milisegundos
  private readonly ALIEN_BULLET_SPEED = 3;
  private readonly POWER_UP_SPEED = 2;

  // Variables de detección de dispositivo móvil
  public isMobile: boolean = false;
  private touchButtons: TouchButton[] = [];
  private continuousShoot: boolean = false;

  // Game state variables
  private gameState: 'intro' | 'playing' | 'win' | 'gameOver' | 'paused' = 'intro';
  private score: number = 0;
  private wave: number = 1;
  private lives: number = 3;
  private highScore: number = 0;

  // Player (Ship)
  private player = {
    x: 0,
    y: 0,
    width: 30,
    height: 30,
    isMovingLeft: false,
    isMovingRight: false,
    hasShield: false,
    shieldTime: 0,
    rapidFire: false,
    rapidFireTime: 0,
    multiShot: false,
    multiShotTime: 0,
    invulnerable: false,
    invulnerableTime: 0
  };

  // Aliens
  private aliens: any[] = [];
  private alienHorizontalSpeed = 1;
  private alienRows = 3;
  private alienCols = 8;
  private alienBullets: any[] = [];
  private lastAlienShot = 0;

  // Bullets
  private bullets: any[] = [];
  private lastShotTime = 0;

  // Power-ups
  private powerUps: PowerUp[] = [];
  private lastPowerUpSpawn = 0;

  // Particles system
  private particles: Particle[] = [];

  // Background stars
  private stars: { x: number; y: number; speed: number; brightness: number }[] = [];

  // Sound effects
  private audioContext: any;
  private synth: any;
  private polySynth!: Tone.PolySynth;

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Detectar si es dispositivo móvil
    this.isMobile = this.detectMobileDevice();

    this.setCanvasSize();
    window.addEventListener('resize', () => this.setCanvasSize());

    // Cargar high score desde localStorage
    this.loadHighScore();

    // Inicializar estrellas de fondo
    this.initStars();

    // Inicializar controles táctiles si es móvil
    if (this.isMobile) {
      this.initTouchControls();
    }

    // Iniciar la carga de Tone.js
    this.loadToneJs();

    this.initGame();
    this.animate();


    this.initTone();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.saveHighScore();
  }

  private detectMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || ('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0);
  }

  private setCanvasSize(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    } else {
      canvas.width = this.isMobile ? window.innerWidth : 800;
      canvas.height = this.isMobile ? window.innerHeight : 600;
    }

    // Reposicionar jugador después del redimensionado
    if (this.player) {
      this.player.x = Math.min(this.player.x, canvas.width - this.player.width);
      this.player.y = canvas.height - this.player.height - (this.isMobile ? 100 : 10);
    }

    // Reconfigurar botones táctiles si es móvil
    if (this.isMobile) {
      this.setupTouchButtons();
    }
  }

  private initTouchControls(): void {
    const canvas = this.canvasRef.nativeElement;

    // Configurar botones táctiles
    this.setupTouchButtons();

    // Event listeners para touch
    canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    canvas.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });

    // Prevenir scroll en el canvas
    canvas.addEventListener('touchstart', (e) => e.preventDefault());
    canvas.addEventListener('touchmove', (e) => e.preventDefault());
  }

  private setupTouchButtons(): void {
    const canvas = this.canvasRef.nativeElement;
    const buttonHeight = 60;
    const buttonWidth = 80;
    const margin = 20;
    const bottomOffset = 20;

    this.touchButtons = [
      {
        x: margin,
        y: canvas.height - buttonHeight - bottomOffset,
        width: buttonWidth,
        height: buttonHeight,
        label: '◄',
        action: 'left',
        isPressed: false
      },
      {
        x: margin + buttonWidth + 20,
        y: canvas.height - buttonHeight - bottomOffset,
        width: buttonWidth,
        height: buttonHeight,
        label: '►',
        action: 'right',
        isPressed: false
      },
      {
        x: canvas.width - buttonWidth - margin,
        y: canvas.height - buttonHeight - bottomOffset,
        width: buttonWidth,
        height: buttonHeight,
        label: '🔫',
        action: 'shoot',
        isPressed: false
      },
      {
        x: canvas.width - buttonWidth * 2 - margin - 20,
        y: canvas.height - buttonHeight - bottomOffset,
        width: buttonWidth * 0.8,
        height: buttonHeight * 0.8,
        label: '⏸',
        action: 'pause',
        isPressed: false
      }
    ];
  }

  private onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();

    Array.from(event.touches).forEach(touch => {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (this.gameState === 'playing' || this.gameState === 'paused') {
        this.handleTouchInput(x, y, 'start');
      } else if (this.gameState === 'intro' || this.gameState === 'gameOver' || this.gameState === 'win') {
        // Toque en cualquier lugar para comenzar/continuar
        this.handleMenuTouch();
      }
    });
  }

  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    // Mantener los botones presionados si el dedo sigue sobre ellos
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();

    // Reset all button states
    this.touchButtons.forEach(btn => btn.isPressed = false);
    this.player.isMovingLeft = false;
    this.player.isMovingRight = false;
    this.continuousShoot = false;

    Array.from(event.touches).forEach(touch => {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (this.gameState === 'playing') {
        this.handleTouchInput(x, y, 'move');
      }
    });
  }

  private onTouchEnd(event: TouchEvent): void {
    event.preventDefault();

    // Reset button states and movement
    this.touchButtons.forEach(btn => btn.isPressed = false);
    this.player.isMovingLeft = false;
    this.player.isMovingRight = false;
    this.continuousShoot = false;
  }

  private handleTouchInput(x: number, y: number, type: 'start' | 'move'): void {
    this.touchButtons.forEach(button => {
      if (this.isPointInButton(x, y, button)) {
        button.isPressed = true;

        switch (button.action) {
          case 'left':
            this.player.isMovingLeft = true;
            break;
          case 'right':
            this.player.isMovingRight = true;
            break;
          case 'shoot':
            if (type === 'start') {
              this.shoot();
            }
            this.continuousShoot = true;
            break;
          case 'pause':
            if (type === 'start') {
              this.togglePause();
            }
            break;
        }
      }
    });
  }

  private handleMenuTouch(): void {
    if (this.gameState === 'intro' || this.gameState === 'gameOver') {
      this.initGame();
      this.startGame();
    } else if (this.gameState === 'win') {
      this.gameState = 'playing';
      this.createAliens();
    }
  }

  private isPointInButton(x: number, y: number, button: TouchButton): boolean {
    return x >= button.x &&
      x <= button.x + button.width &&
      y >= button.y &&
      y <= button.y + button.height;
  }

  private loadHighScore(): void {
    try {
      const saved = localStorage.getItem('spaceInvadersHighScore');
      this.highScore = saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      this.highScore = 0;
    }
  }

  private saveHighScore(): void {
    try {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('spaceInvadersHighScore', this.highScore.toString());
      }
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  private initStars(): void {
    this.stars = [];
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * this.canvasRef.nativeElement.width,
        y: Math.random() * this.canvasRef.nativeElement.height,
        speed: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.8 + 0.2
      });
    }
  }

  private loadToneJs(): void {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js';
    script.onload = () => {
      this.toneJsLoaded = true;
      this.audioContext = new (window as any).AudioContext();
      this.synth = new (window as any).Tone.Synth().toDestination();
    };
    document.head.appendChild(script);
  }

  /**
   * Inicializa el estado del juego.
   */
  private initGame(): void {
    this.gameState = 'intro';
    this.score = 0;
    this.wave = 1;
    this.lives = 3;
    this.alienHorizontalSpeed = 1;

    // Reset player power-ups
    this.player.hasShield = false;
    this.player.rapidFire = false;
    this.player.multiShot = false;
    this.player.invulnerable = false;

    // Clear arrays
    this.bullets = [];
    this.alienBullets = [];
    this.powerUps = [];
    this.particles = [];

    // Posicionar jugador
    this.player.x = this.canvasRef.nativeElement.width / 2 - this.player.width / 2;
    this.player.y = this.canvasRef.nativeElement.height - this.player.height - (this.isMobile ? 100 : 10);

    this.createAliens();
    this.initStars();

    // Reconfigurar botones táctiles si es móvil
    if (this.isMobile) {
      this.setupTouchButtons();
    }
  }

  /**
   * Configura la cuadrícula de aliens.
   */
  private createAliens(): void {
    this.aliens = [];
    const alienWidth = this.isMobile ? 15 : 20;
    const alienHeight = this.isMobile ? 15 : 20;
    const padding = this.isMobile ? 8 : 10;
    const offsetX = this.isMobile ? 20 : 50;
    const offsetY = 30;

    // Ajustar número de aliens para móvil
    const cols = this.isMobile ? Math.min(this.alienCols, 6) : this.alienCols;
    const rows = this.isMobile ? Math.min(this.alienRows, 4) : this.alienRows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Diferentes tipos de aliens con diferentes puntuaciones
        let alienType = 'basic';
        let points = 10;
        if (row === 0) {
          alienType = 'fast';
          points = 30;
        } else if (row === 1) {
          alienType = 'medium';
          points = 20;
        }

        this.aliens.push({
          x: offsetX + col * (alienWidth + padding),
          y: offsetY + row * (alienHeight + padding),
          width: alienWidth,
          height: alienHeight,
          speedY: 0.1 * this.wave,
          speedX: this.alienHorizontalSpeed,
          isDead: false,
          type: alienType,
          points: points,
          lastShot: 0
        });
      }
    }
  }

  /**
   * Maneja la entrada del teclado (para desktop).
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.gameState === 'playing') {
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.player.isMovingLeft = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.player.isMovingRight = true;
          break;
        case ' ': // Espacio
        case 'w':
        case 'W':
        case 'ArrowUp':
          event.preventDefault();
          this.shoot();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          this.togglePause();
          break;
      }
    } else if (this.gameState === 'paused') {
      if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
        this.togglePause();
      }
    } else if (event.key === 'Enter') {
      // Maneja la transición del estado de la pantalla de inicio, victoria o derrota
      if (this.gameState === 'intro' || this.gameState === 'gameOver') {
        this.initGame();
        this.startGame();
      } else if (this.gameState === 'win') {
        this.gameState = 'playing';
        this.createAliens();
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (this.gameState !== 'playing') return;

    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.player.isMovingLeft = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.player.isMovingRight = false;
        break;
    }
  }

  private togglePause(): void {
    if (this.gameState === 'playing') {
      this.gameState = 'paused';
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing';
    }
  }

 

  /**
   * Inicia el juego.
   */ 
  private backgroundAudio: HTMLAudioElement | null = null;
  private startGame(): void {
    if (this.gameState !== 'playing') {
      this.gameState = 'playing';
      this.startBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  startBackgroundMusic(): void {
    if (!this.backgroundAudio) {
      this.backgroundAudio = new Audio('assets/audio/aliens-arrival.mp3');
      this.backgroundAudio.loop = true; // 🔁 bucle infinito
      this.backgroundAudio.volume = 0.5; // volumen (0 a 1)
      this.backgroundAudio.play().catch(err => {
        console.warn('Error al reproducir audio:', err);
      });
    }
  }

  stopBackgroundMusic(): void {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.currentTime = 0;
      this.backgroundAudio = null;
    }
  }
  /**
   * Dispara una bala si el tiempo de recarga ha pasado.
   */
  private shoot(): void {
    const now = Date.now();
    const cooldown = this.player.rapidFire ? this.SHOOT_COOLDOWN / 3 : this.SHOOT_COOLDOWN;

    if (now - this.lastShotTime > cooldown) {
      if (this.player.multiShot) {
        // Disparo múltiple
        this.bullets.push(
          {
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            vx: 0
          },
          {
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            vx: -2
          },
          {
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            vx: 2
          }
        );
      } else {
        // Disparo normal
        this.bullets.push({
          x: this.player.x + this.player.width / 2 - 2,
          y: this.player.y,
          width: 4,
          height: 10,
          vx: 0
        });
      }
      this.lastShotTime = now;
      this.playSound('shoot');
    }
  }

  /**
   * Los aliens disparan ocasionalmente
   */
  private alienShoot(): void {
    const now = Date.now();
    if (now - this.lastAlienShot > 1000 + Math.random() * 2000) {
      const frontAliens = this.aliens.filter(alien => !alien.isDead);
      if (frontAliens.length > 0) {
        const shooter = frontAliens[Math.floor(Math.random() * frontAliens.length)];
        this.alienBullets.push({
          x: shooter.x + shooter.width / 2 - 2,
          y: shooter.y + shooter.height,
          width: 3,
          height: 8
        });
        this.lastAlienShot = now;
      }
    }
  }

  /**
   * Genera power-ups ocasionalmente
   */
  private spawnPowerUp(): void {
    const now = Date.now();
    if (now - this.lastPowerUpSpawn > 15000 + Math.random() * 10000) {
      const types: PowerUp['type'][] = ['rapidFire', 'shield', 'multiShot', 'scoreBonus'];
      const type = types[Math.floor(Math.random() * types.length)];

      this.powerUps.push({
        x: Math.random() * (this.canvasRef.nativeElement.width - 30),
        y: -20,
        width: 20,
        height: 20,
        type: type,
        speedY: this.POWER_UP_SPEED
      });

      this.lastPowerUpSpawn = now;
    }
  }

  /**
   * Crea partículas para efectos visuales
   */
  private createParticles(x: number, y: number, color: string, count: number = 8): void {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 60,
        maxLife: 60,
        color: color
      });
    }
  }

  /**
   * Reproduce un sonido del juego.
   */
  async initTone(): Promise<void> {
    await Tone.start(); // desbloquea el audio en algunos navegadores
    this.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.toneJsLoaded = true;
    console.log('Tone.js listo 🎵');
  }

  playSound(type: 'shoot' | 'alien_hit' | 'game_over' | 'win_game' | 'powerup' | 'player_hit'): void {
    if (!this.toneJsLoaded) return;

    switch (type) {
      case 'shoot':
        this.polySynth.triggerAttackRelease('C4', '8n'); // disparo
        break;

      case 'alien_hit':
        this.polySynth.triggerAttackRelease('E2', '16n'); // golpe alien
        break;

      case 'game_over':
        this.polySynth.triggerAttackRelease(['C3', 'G2'], '2n'); // acorde triste
        break;

      case 'win_game':
        this.polySynth.triggerAttackRelease(['C4', 'E4', 'G4'], '4n'); // acorde feliz
        break;

      case 'powerup':
        this.polySynth.triggerAttackRelease(['F4', 'A4', 'C5'], '8n'); // acorde powerup
        break;

      case 'player_hit':
        this.polySynth.triggerAttackRelease(['D2', 'F#2'], '4n'); // golpe al jugador
        break;
    }
  }

  /**
   * Bucle principal de animación.
   */
  private animate(): void {
    switch (this.gameState) {
      case 'intro':
        this.drawIntroScreen();
        break;
      case 'playing':
        this.updateGame();
        this.drawGame();
        break;
      case 'paused':
        this.drawGame();
        this.drawPauseScreen();
        break;
      case 'win':
        this.drawWinScreen();
        break;
      case 'gameOver':
        this.drawGameOverScreen();
        break;
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Actualiza la lógica del juego.
   */
  private updateGame(): void {
    this.updateBackground();
    this.updatePlayerMovement();
    this.updateBullets();
    this.updateAlienBullets();
    this.updateAliens();
    this.updatePowerUps();
    this.updateParticles();
    this.updatePlayerPowerUps();
    this.checkCollisions();
    this.checkGameState();
    this.alienShoot();
    this.spawnPowerUp();

    // Disparo continuo en móvil
    if (this.isMobile && this.continuousShoot) {
      this.shoot();
    }
  }

  private updateBackground(): void {
    this.stars.forEach(star => {
      star.y += star.speed;
      if (star.y > this.canvasRef.nativeElement.height) {
        star.y = 0;
        star.x = Math.random() * this.canvasRef.nativeElement.width;
      }
    });
  }

  private updatePlayerPowerUps(): void {
    const now = Date.now();

    // Actualizar duración de power-ups
    if (this.player.rapidFire && now - this.player.rapidFireTime > 10000) {
      this.player.rapidFire = false;
    }

    if (this.player.multiShot && now - this.player.multiShotTime > 8000) {
      this.player.multiShot = false;
    }

    if (this.player.hasShield && now - this.player.shieldTime > 15000) {
      this.player.hasShield = false;
    }

    if (this.player.invulnerable && now - this.player.invulnerableTime > 3000) {
      this.player.invulnerable = false;
    }
  }

  /**
   * Actualiza la posición del jugador.
   */
  private updatePlayerMovement(): void {
    if (this.player.isMovingLeft && this.player.x > 0) {
      this.player.x -= this.PLAYER_SPEED;
    }
    if (this.player.isMovingRight && this.player.x + this.player.width < this.canvasRef.nativeElement.width) {
      this.player.x += this.PLAYER_SPEED;
    }
  }

  /**
   * Actualiza la posición de las balas.
   */
  private updateBullets(): void {
    this.bullets.forEach(bullet => {
      bullet.y -= this.BULLET_SPEED;
      bullet.x += bullet.vx || 0;
    });
    this.bullets = this.bullets.filter(bullet =>
      bullet.y + bullet.height > 0 &&
      bullet.x > -10 &&
      bullet.x < this.canvasRef.nativeElement.width + 10
    );
  }

  private updateAlienBullets(): void {
    this.alienBullets.forEach(bullet => bullet.y += this.ALIEN_BULLET_SPEED);
    this.alienBullets = this.alienBullets.filter(bullet =>
      bullet.y < this.canvasRef.nativeElement.height
    );
  }

  private updatePowerUps(): void {
    this.powerUps.forEach(powerUp => powerUp.y += powerUp.speedY);
    this.powerUps = this.powerUps.filter(powerUp =>
      powerUp.y < this.canvasRef.nativeElement.height
    );
  }

  private updateParticles(): void {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      particle.vy += 0.1; // Gravedad
    });
    this.particles = this.particles.filter(particle => particle.life > 0);
  }

  /**
   * Actualiza la posición de los aliens.
   */
  private updateAliens(): void {
    let shouldDrop = false;
    this.aliens.forEach(alien => {
      if (!alien.isDead) {
        alien.x += alien.speedX;
        if (alien.x + alien.width > this.canvasRef.nativeElement.width || alien.x < 0) {
          shouldDrop = true;
        }
      }
    });

    if (shouldDrop) {
      this.aliens.forEach(alien => {
        if (!alien.isDead) {
          alien.speedX *= -1; // Cambiar dirección horizontal
          alien.y += 20; // Bajar más rápido
        }
      });
    }
  }

  /**
   * Comprueba colisiones entre balas y aliens.
   */
  private checkCollisions(): void {
    // Colisiones balas del jugador con aliens
    this.bullets.forEach((bullet, bulletIndex) => {
      this.aliens.forEach((alien, alienIndex) => {
        if (!alien.isDead && this.isColliding(bullet, alien)) {
          alien.isDead = true;
          this.score += alien.points;
          this.bullets.splice(bulletIndex, 1);
          this.playSound('alien_hit');
          this.createParticles(alien.x + alien.width / 2, alien.y + alien.height / 2, '#ff00ff', 6);
        }
      });
    });

    // Colisiones balas de aliens con jugador
    this.alienBullets.forEach((bullet, bulletIndex) => {
      if (this.isColliding(bullet, this.player)) {
        this.alienBullets.splice(bulletIndex, 1);
        if (!this.player.hasShield && !this.player.invulnerable) {
          this.lives--;
          this.player.invulnerable = true;
          this.player.invulnerableTime = Date.now();
          this.playSound('player_hit');
          this.createParticles(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#00ff00', 8);
        }
      }
    });

    // Colisiones power-ups con jugador
    this.powerUps.forEach((powerUp, powerUpIndex) => {
      if (this.isColliding(powerUp, this.player)) {
        this.powerUps.splice(powerUpIndex, 1);
        this.applyPowerUp(powerUp.type);
        this.playSound('powerup');
        this.createParticles(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, '#ffff00', 6);
      }
    });

    // Eliminar aliens muertos
    this.aliens = this.aliens.filter(alien => !alien.isDead);
  }

  private applyPowerUp(type: PowerUp['type']): void {
    const now = Date.now();

    switch (type) {
      case 'rapidFire':
        this.player.rapidFire = true;
        this.player.rapidFireTime = now;
        break;
      case 'shield':
        this.player.hasShield = true;
        this.player.shieldTime = now;
        break;
      case 'multiShot':
        this.player.multiShot = true;
        this.player.multiShotTime = now;
        break;
      case 'scoreBonus':
        this.score += 100;
        break;
    }
  }

  /**
   * Verifica si dos objetos están colisionando.
   */
  private isColliding(obj1: any, obj2: any): boolean {
    return obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y;
  }

  /**
   * Recarga la página después de un retraso cuando el juego termina
   */
  private reloadPageAfterGameOver(): void {
    // Recargar la página después de 3 segundos
    setTimeout(() => {
      this.initGame();   // Reinicia estado y variables
      this.startGame();  // Vuelve a poner gameState = 'playing'
      /* window.location.reload(); */
    }, 3000);
  }

  private victoryAchieved(): void {
    // Victoria: sin aliens vivos
    if (this.aliens.length === 0 && this.gameState === 'playing') {
      this.wave++;
      if (this.wave > 3) {
        this.gameState = 'win';
        this.playSound('win_game');
      } else {
        this.createAliens();
      }
    }
  }

  /**
   * Comprueba el estado del juego (victoria, derrota, siguiente oleada).
   */
  private checkGameState(): void {
    // Comprobar si todos los aliens están muertos
    const aliveAliens = this.aliens.filter(alien => !alien.isDead);
    if (aliveAliens.length === 0) {
      this.wave++;
      this.alienHorizontalSpeed += 0.5;
      this.alienRows = Math.min(this.alienRows + 1, 6);
      this.createAliens();
      this.score += 50 * this.wave; // Bonus por completar oleada
      this.playSound('win_game');
      console.log(`Oleada ${this.wave} iniciada! - ganaste`); // Mensaje en consola

    }

    // Comprobar si el jugador se queda sin vidas
    if (this.lives <= 0) {
      this.gameState = 'gameOver';
      this.playSound('game_over');
      this.saveHighScore();
      // Recargar la página automáticamente después del game over
      this.reloadPageAfterGameOver();
    }

    // Comprobar si los aliens llegan al jugador
    const playerReached = this.aliens.some(alien =>
      !alien.isDead && alien.y + alien.height >= this.player.y
    );
    if (playerReached) {
      this.lives = 0;
      this.gameState = 'gameOver';
      this.playSound('game_over');
      this.saveHighScore();
      // Recargar la página automáticamente después del game over
      this.reloadPageAfterGameOver();
    }
  }

  /**
   * Dibuja el estado actual del juego.
   */
  private drawGame(): void {
    this.clearCanvas();
    this.drawBackground();
    this.drawAliens();
    this.drawBullets();
    this.drawAlienBullets();
    this.drawPowerUps();
    this.drawParticles();
    this.drawPlayer();
    this.drawUI();

    if (this.isMobile) {
      this.drawTouchControls();
    }
  }

  private clearCanvas(): void {
    this.ctx.fillStyle = '#000011';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  private drawBackground(): void {
    // Dibujar estrellas
    this.ctx.fillStyle = 'white';
    this.stars.forEach(star => {
      this.ctx.globalAlpha = star.brightness;
      this.ctx.fillRect(star.x, star.y, 1, 1);
    });
    this.ctx.globalAlpha = 1;
  }

  private drawPlayer(): void {
    const flickering = this.player.invulnerable && Math.floor(Date.now() / 100) % 2;

    if (!flickering) {
      // Dibujar escudo si está activo
      if (this.player.hasShield) {
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(
          this.player.x + this.player.width / 2,
          this.player.y + this.player.height / 2,
          this.player.width / 2 + 5,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
      }

      // Dibujar nave del jugador
      this.ctx.fillStyle = '#00ff00';
      this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

      // Detalles de la nave
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(this.player.x + this.player.width / 2 - 2, this.player.y, 4, 8);
    }
  }

  private drawAliens(): void {
    this.aliens.forEach(alien => {
      if (!alien.isDead) {
        // Color según el tipo de alien
        switch (alien.type) {
          case 'fast':
            this.ctx.fillStyle = '#ff0000';
            break;
          case 'medium':
            this.ctx.fillStyle = '#ffff00';
            break;
          default:
            this.ctx.fillStyle = '#ff00ff';
        }

        this.ctx.fillRect(alien.x, alien.y, alien.width, alien.height);

        // Detalles del alien
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(alien.x + 2, alien.y + 2, alien.width - 4, alien.height - 4);
      }
    });
  }

  private drawBullets(): void {
    this.ctx.fillStyle = '#00ff00';
    this.bullets.forEach(bullet => {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
  }

  private drawAlienBullets(): void {
    this.ctx.fillStyle = '#ff0000';
    this.alienBullets.forEach(bullet => {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
  }

  private drawPowerUps(): void {
    this.powerUps.forEach(powerUp => {
      // Color según el tipo de power-up
      switch (powerUp.type) {
        case 'rapidFire':
          this.ctx.fillStyle = '#ff8800';
          break;
        case 'shield':
          this.ctx.fillStyle = '#00ffff';
          break;
        case 'multiShot':
          this.ctx.fillStyle = '#8800ff';
          break;
        case 'scoreBonus':
          this.ctx.fillStyle = '#ffff00';
          break;
      }

      this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

      // Indicador del tipo
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      let symbol = '';
      switch (powerUp.type) {
        case 'rapidFire': symbol = 'R'; break;
        case 'shield': symbol = 'S'; break;
        case 'multiShot': symbol = 'M'; break;
        case 'scoreBonus': symbol = '$'; break;
      }
      this.ctx.fillText(symbol, powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2 + 4);
    });
  }

  private drawParticles(): void {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(particle.x, particle.y, 2, 2);
    });
    this.ctx.globalAlpha = 1;
  }

  private drawUI(): void {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = this.isMobile ? '16px Arial' : '20px Arial';
    this.ctx.textAlign = 'left';

    const margin = 10;
    let y = 30;

    this.ctx.fillText(`Score: ${this.score}`, margin, y);
    y += this.isMobile ? 25 : 30;

    this.ctx.fillText(`Lives: ${this.lives}`, margin, y);
    y += this.isMobile ? 25 : 30;

    this.ctx.fillText(`Wave: ${this.wave}`, margin, y);
    y += this.isMobile ? 25 : 30;

    this.ctx.fillText(`High Score: ${this.highScore}`, margin, y);

    // Mostrar power-ups activos
    const rightMargin = this.canvasRef.nativeElement.width - 150;
    y = 30;

    if (this.player.rapidFire) {
      this.ctx.fillStyle = '#ff8800';
      this.ctx.fillText('Rapid Fire', rightMargin, y);
      y += 25;
    }

    if (this.player.multiShot) {
      this.ctx.fillStyle = '#8800ff';
      this.ctx.fillText('Multi Shot', rightMargin, y);
      y += 25;
    }

    if (this.player.hasShield) {
      this.ctx.fillStyle = '#00ffff';
      this.ctx.fillText('Shield', rightMargin, y);
      y += 25;
    }

    this.ctx.fillStyle = '#ffffff';
  }

  private drawTouchControls(): void {
    this.touchButtons.forEach(button => {
      // Fondo del botón
      this.ctx.fillStyle = button.isPressed ? '#555555' : '#333333';
      this.ctx.fillRect(button.x, button.y, button.width, button.height);

      // Borde del botón
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(button.x, button.y, button.width, button.height);

      // Texto del botón
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        button.label,
        button.x + button.width / 2,
        button.y + button.height / 2 + 8
      );
    });
  }

  private drawIntroScreen(): void {
    this.clearCanvas();
    this.drawBackground();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = this.isMobile ? '28px Arial' : '36px Arial';
    this.ctx.textAlign = 'center';

    const centerX = this.canvasRef.nativeElement.width / 2;
    const centerY = this.canvasRef.nativeElement.height / 2;

    this.ctx.fillText('SPACE INVADERS', centerX, centerY - 100);

    this.ctx.font = this.isMobile ? '16px Arial' : '20px Arial';
    this.ctx.fillText(`High Score: ${this.highScore}`, centerX, centerY - 50);

    // Instrucciones
    this.ctx.font = this.isMobile ? '14px Arial' : '16px Arial';

    if (this.isMobile) {
      this.ctx.fillText('Tap to start', centerX, centerY + 20);
      this.ctx.fillText('Use touch controls to play', centerX, centerY + 50);
    } else {
      this.ctx.fillText('Press ENTER to start', centerX, centerY + 20);
      this.ctx.fillText('Arrow keys or A/D to move', centerX, centerY + 50);
      this.ctx.fillText('SPACE or W to shoot', centerX, centerY + 80);
      this.ctx.fillText('P to pause', centerX, centerY + 110);
    }
  }

  private drawGameOverScreen(): void {
    this.clearCanvas();
    this.drawBackground();

    this.ctx.fillStyle = '#ff0000';
    this.ctx.font = this.isMobile ? '28px Arial' : '36px Arial';
    this.ctx.textAlign = 'center';

    const centerX = this.canvasRef.nativeElement.width / 2;
    const centerY = this.canvasRef.nativeElement.height / 2;

    this.ctx.fillText('GAME OVER', centerX, centerY - 100);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = this.isMobile ? '18px Arial' : '24px Arial';
    this.ctx.fillText(`Final Score: ${this.score}`, centerX, centerY - 50);
    this.ctx.fillText(`High Score: ${this.highScore}`, centerX, centerY - 20);
    this.ctx.fillText(`Wave Reached: ${this.wave}`, centerX, centerY + 10);

    this.ctx.font = this.isMobile ? '14px Arial' : '16px Arial';
    this.ctx.fillStyle = '#ffff00';
    this.ctx.fillText('Reloading in 3 seconds...', centerX, centerY + 50);

    if (this.isMobile) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('Or tap to restart now', centerX, centerY + 80);
    } else {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('Or press ENTER to restart now', centerX, centerY + 80);
    }
  }

  private drawWinScreen(): void {
    this.clearCanvas();
    this.drawBackground();

    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = this.isMobile ? '28px Arial' : '36px Arial';
    this.ctx.textAlign = 'center';

    const centerX = this.canvasRef.nativeElement.width / 2;
    const centerY = this.canvasRef.nativeElement.height / 2;

    this.ctx.fillText('WAVE COMPLETE!', centerX, centerY - 100);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = this.isMobile ? '18px Arial' : '24px Arial';
    this.ctx.fillText(`Score: ${this.score}`, centerX, centerY - 50);
    this.ctx.fillText(`Wave: ${this.wave}`, centerX, centerY - 20);

    this.ctx.font = this.isMobile ? '14px Arial' : '16px Arial';

    if (this.isMobile) {
      this.ctx.fillText('Tap for next wave', centerX, centerY + 40);
    } else {
      this.ctx.fillText('Press ENTER for next wave', centerX, centerY + 40);
    }
  }

  private drawPauseScreen(): void {
    // Dibujar overlay semi-transparente
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = this.isMobile ? '24px Arial' : '32px Arial';
    this.ctx.textAlign = 'center';

    const centerX = this.canvasRef.nativeElement.width / 2;
    const centerY = this.canvasRef.nativeElement.height / 2;

    this.ctx.fillText('PAUSED', centerX, centerY - 20);

    this.ctx.font = this.isMobile ? '14px Arial' : '16px Arial';

    if (this.isMobile) {
      this.ctx.fillText('Tap pause button to continue', centerX, centerY + 20);
    } else {
      this.ctx.fillText('Press P or ESC to continue', centerX, centerY + 20);
    }
  }
}