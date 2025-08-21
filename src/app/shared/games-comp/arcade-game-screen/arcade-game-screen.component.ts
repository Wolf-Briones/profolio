import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

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

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    this.setCanvasSize();
    window.addEventListener('resize', () => this.setCanvasSize());
    
    // Cargar high score desde localStorage
    this.loadHighScore();
    
    // Inicializar estrellas de fondo
    this.initStars();
    
    // Iniciar la carga de Tone.js
    this.loadToneJs();

    this.initGame();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.saveHighScore();
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
    this.player.y = this.canvasRef.nativeElement.height - this.player.height - 10;
    
    this.createAliens();
    this.initStars();
  }
  
  /**
   * Configura la cuadrícula de aliens.
   */
  private createAliens(): void {
    this.aliens = [];
    const alienWidth = 20;
    const alienHeight = 20;
    const padding = 10;
    const offsetX = 50;
    const offsetY = 30;

    for (let row = 0; row < this.alienRows; row++) {
      for (let col = 0; col < this.alienCols; col++) {
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
   * Maneja la entrada del teclado.
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
  private startGame(): void {
    if (this.gameState !== 'playing') {
      this.gameState = 'playing';
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
  private playSound(type: 'shoot' | 'alien_hit' | 'game_over' | 'win_game' | 'powerup' | 'player_hit'): void {
    if (!this.toneJsLoaded) return;

    switch (type) {
      case 'shoot':
        this.synth.triggerAttackRelease('C4', '8n');
        break;
      case 'alien_hit':
        this.synth.triggerAttackRelease('E2', '16n');
        break;
      case 'game_over':
        this.synth.triggerAttackRelease(['C3', 'G2'], '2n');
        break;
      case 'win_game':
        this.synth.triggerAttackRelease(['C4', 'E4', 'G4'], '4n');
        break;
      case 'powerup':
        this.synth.triggerAttackRelease(['F4', 'A4', 'C5'], '8n');
        break;
      case 'player_hit':
        this.synth.triggerAttackRelease(['D2', 'F#2'], '4n');
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
          this.createParticles(alien.x + alien.width/2, alien.y + alien.height/2, '#ff00ff', 6);
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
          this.createParticles(this.player.x + this.player.width/2, this.player.y + this.player.height/2, '#00ff00', 8);
        }
      }
    });
    
    // Colisiones power-ups con jugador
    this.powerUps.forEach((powerUp, powerUpIndex) => {
      if (this.isColliding(powerUp, this.player)) {
        this.powerUps.splice(powerUpIndex, 1);
        this.applyPowerUp(powerUp.type);
        this.playSound('powerup');
        this.createParticles(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, '#ffff00', 6);
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
   * Función auxiliar para verificar colisiones rectangulares.
   */
  private isColliding(rect1: any, rect2: any): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * Comprueba el estado de victoria o derrota del juego.
   */
  private checkGameState(): void {
    // Actualizar high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    
    // Victoria
    if (this.aliens.length === 0) {
      this.gameState = 'win';
      this.playSound('win_game');
      // Aumentar dificultad para la siguiente oleada
      this.wave++;
      if (this.alienRows < 5) this.alienRows++;
      if (this.alienCols < 10) this.alienCols++;
      this.alienHorizontalSpeed *= 1.2;
    }

    // Derrota por aliens llegando abajo
    const canvasHeight = this.canvasRef.nativeElement.height;
    if (this.aliens.some(alien => !alien.isDead && alien.y + alien.height > canvasHeight - this.player.height - 20)) {
      this.gameState = 'gameOver';
      this.playSound('game_over');
      this.saveHighScore();
    }
    
    // Derrota por quedarse sin vidas
    if (this.lives <= 0) {
      this.gameState = 'gameOver';
      this.playSound('game_over');
      this.saveHighScore();
    }
  }

  /**
   * Dibuja todos los elementos del juego.
   */
  private drawGame(): void {
    // Fondo negro
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    // Dibujar estrellas de fondo
    this.drawStars();
    
    // Dibujar la nave del jugador con efectos especiales
    const playerColor = this.player.invulnerable && Math.floor(Date.now() / 100) % 2 ? '#888888' : '#00ff00';
    this.drawPixelArt(this.player.x, this.player.y, playerColor, [
        [0,0,1,0,0],
        [0,1,1,1,0],
        [1,1,1,1,1],
        [1,0,1,0,1]
    ], 6);
    
    // Dibujar escudo del jugador
    if (this.player.hasShield) {
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(this.player.x + this.player.width/2, this.player.y + this.player.height/2, 25, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

    // Dibujar balas del jugador
    this.ctx.fillStyle = '#ffff00';
    this.bullets.forEach(bullet => {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
    // Dibujar balas de aliens
    this.ctx.fillStyle = '#ff0000';
    this.alienBullets.forEach(bullet => {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Dibujar aliens con diferentes colores según tipo
    this.aliens.forEach(alien => {
      if (!alien.isDead) {
        let color = '#ff00ff';
        if (alien.type === 'fast') color = '#ff4444';
        else if (alien.type === 'medium') color = '#4444ff';
        
        this.drawPixelArt(alien.x, alien.y, color, [
          [0,1,0,0,1,0],
          [0,0,1,1,0,0],
          [0,1,1,1,1,0],
          [1,1,0,0,1,1],
          [0,0,1,1,0,0]
        ], 4);
      }
    });
    
    // Dibujar power-ups
    this.powerUps.forEach(powerUp => {
      let color = '#ffff00';
      let symbol = [
        [1,1,1],
        [1,0,1],
        [1,1,1]
      ];
      
      switch (powerUp.type) {
        case 'rapidFire':
          color = '#ff8800';
          symbol = [
            [1,0,1],
            [0,1,0],
            [1,0,1]
          ];
          break;
        case 'shield':
          color = '#00ffff';
          symbol = [
            [0,1,0],
            [1,0,1],
            [0,1,0]
          ];
          break;
        case 'multiShot':
          color = '#ff0088';
          symbol = [
            [1,0,1],
            [1,1,1],
            [1,0,1]
          ];
          break;
        case 'scoreBonus':
          color = '#88ff00';
          break;
      }
      
      this.drawPixelArt(powerUp.x, powerUp.y, color, symbol, 7);
    });
    
    // Dibujar partículas
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
    });
    
    // UI del juego
    this.drawGameUI();
  }
  
  private drawStars(): void {
    this.stars.forEach(star => {
      const alpha = Math.floor(star.brightness * 255).toString(16).padStart(2, '0');
      this.ctx.fillStyle = `#ffffff${alpha}`;
      this.ctx.fillRect(star.x, star.y, 1, 1);
    });
  }
  
  private drawGameUI(): void {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'left';
    
    // Puntuación y estadísticas
    this.ctx.fillText(`PUNTUACIÓN: ${this.score}`, 10, 25);
    this.ctx.fillText(`RÉCORD: ${this.highScore}`, 10, 45);
    this.ctx.fillText(`OLEADA: ${this.wave}`, 10, 65);
    
    // Vidas
    this.ctx.fillText(`VIDAS: `, 10, 85);
    for (let i = 0; i < this.lives; i++) {
      this.drawPixelArt(70 + i * 25, 70, '#00ff00', [
        [0,0,1,0,0],
        [0,1,1,1,0],
        [1,1,1,1,1]
      ], 3);
    }
    
    // Indicadores de power-ups activos
    let powerUpY = this.canvasRef.nativeElement.height - 80;
    this.ctx.font = '12px monospace';
    
    if (this.player.rapidFire) {
      this.ctx.fillStyle = '#ff8800';
      this.ctx.fillText('DISPARO RÁPIDO', 10, powerUpY);
      powerUpY -= 20;
    }
    
    if (this.player.multiShot) {
      this.ctx.fillStyle = '#ff0088';
      this.ctx.fillText('DISPARO MÚLTIPLE', 10, powerUpY);
      powerUpY -= 20;
    }
    
    if (this.player.hasShield) {
      this.ctx.fillStyle = '#00ffff';
      this.ctx.fillText('ESCUDO ACTIVO', 10, powerUpY);
      powerUpY -= 20;
    }
  }

  /**
   * Dibuja un personaje de pixel art a partir de una matriz 2D.
   */
  private drawPixelArt(x: number, y: number, color: string, art: number[][], pixelSize: number): void {
    this.ctx.fillStyle = color;
    art.forEach((row, rowIndex) => {
      row.forEach((pixel, colIndex) => {
        if (pixel) {
          this.ctx.fillRect(x + colIndex * pixelSize, y + rowIndex * pixelSize, pixelSize, pixelSize);
        }
      });
    });
  }
  
  // Métodos para dibujar las diferentes pantallas del juego
  
  private drawIntroScreen(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    // Estrellas de fondo
    this.drawStars();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '32px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('INVASORES GALÁCTICOS', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 120);

    // Mostrar récord
    this.ctx.font = '18px monospace';
    this.ctx.fillStyle = '#ffff00';
    this.ctx.fillText(`RÉCORD: ${this.highScore}`, this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 90);

    // Controles
    this.ctx.font = '14px monospace';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText('CONTROLES:', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 50);
    this.ctx.fillText('← → o A/D - Mover', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 30);
    this.ctx.fillText('ESPACIO o W - Disparar', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 10);
    this.ctx.fillText('P o ESC - Pausa', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 10);
    
    // Power-ups info
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillText('POWER-UPS:', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 40);
    this.ctx.font = '12px monospace';
    this.ctx.fillStyle = '#ff8800';
    this.ctx.fillText('🔥 Disparo Rápido', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 60);
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillText('🛡️ Escudo Protector', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 75);
    this.ctx.fillStyle = '#ff0088';
    this.ctx.fillText('⚡ Disparo Múltiple', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 90);
    this.ctx.fillStyle = '#88ff00';
    this.ctx.fillText('💰 Bonus de Puntos', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 105);
    
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '20px monospace';
    this.ctx.fillText('Pulsa ENTER para empezar', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 140);
  }
  
  private drawPauseScreen(): void {
    // Overlay semi-transparente
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSA', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 20);
    
    this.ctx.font = '18px monospace';
    this.ctx.fillText('Pulsa P o ESC para continuar', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 30);
  }
  
  private drawWinScreen(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    // Estrellas de fondo
    this.drawStars();
    
    // Efecto de victoria con partículas
    this.createParticles(this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 50, '#ffff00', 3);
    
    this.ctx.fillStyle = '#ffff00';
    this.ctx.font = '42px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('¡VICTORIA!', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 60);
    
    this.ctx.font = '24px monospace';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`Puntuación: ${this.score}`, this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 20);
    
    if (this.score >= this.highScore) {
      this.ctx.fillStyle = '#ff0088';
      this.ctx.font = '20px monospace';
      this.ctx.fillText('¡NUEVO RÉCORD!', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 5);
    }
    
    this.ctx.font = '18px monospace';
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fillText(`Oleada ${this.wave - 1} completada`, this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 35);
    
    this.ctx.font = '16px monospace';
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillText(`Pulsa ENTER para la oleada ${this.wave}`, this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 80);
  }

  private drawGameOverScreen(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    // Estrellas de fondo
    this.drawStars();
    
    this.ctx.fillStyle = '#ff0000';
    this.ctx.font = '36px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 60);
    
    this.ctx.font = '20px monospace';
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`Puntuación Final: ${this.score}`, this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 - 20);
    this.ctx.fillText(`Récord: ${this.highScore}`, this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 5);
    this.ctx.fillText(`Oleadas Completadas: ${this.wave - 1}`, this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 30);
    
    if (this.score >= this.highScore) {
      this.ctx.fillStyle = '#ffff00';
      this.ctx.font = '18px monospace';
      this.ctx.fillText('¡NUEVO RÉCORD!', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 55);
    }

    this.ctx.font = '16px monospace';
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillText('Pulsa ENTER para jugar de nuevo', this.canvasRef.nativeElement.width / 2, this.canvasRef.nativeElement.height / 2 + 90);
  }

  /**
   * Establece el tamaño del canvas para que coincida con su contenedor.
   */
  private setCanvasSize(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Reinicializar estrellas cuando cambia el tamaño
    this.initStars();
  }
}