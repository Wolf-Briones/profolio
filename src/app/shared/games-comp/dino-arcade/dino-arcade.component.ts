import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dino-arcade',
  imports: [],
  templateUrl: './dino-arcade.component.html',
  styleUrl: './dino-arcade.component.scss'
})
export class DinoArcadeComponent  implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  
  // Configuración del juego
  private readonly CANVAS_WIDTH = 480;
  private readonly CANVAS_HEIGHT = 200;
  private readonly GROUND_Y = 170;
  
  // Estado del juego
  gameRunning = false;
  gameStarted = false;
  score = 0;
  highScore = 0;
  showGameOver = false;
  private gameSpeed = 2;
  private frameCount = 0;
  
  // Dinosaurio
  private dino = {
    x: 50,
    y: this.GROUND_Y - 40,
    width: 32,
    height: 40,
    velY: 0,
    jumping: false,
    ducking: false,
    animFrame: 0,
    groundY: this.GROUND_Y - 40
  };
  
  // Obstáculos y elementos
  private obstacles: any[] = [];
  private clouds: any[] = [];
  
  // Colores
  private colors = {
    ground: '#555',
    dino: '#555',
    obstacle: '#555',
    cloud: '#ccc',
    background: '#f7f7f7'
  };

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.highScore = parseInt(localStorage.getItem('dinoHighScore') || '0');
    this.initializeGame();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.jump();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.duck();
        break;
    }
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.jump();
  }

  private initializeGame() {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    this.drawGround();
    this.drawDino();
  }

  private drawPixelRect(x: number, y: number, width: number, height: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x), Math.floor(y), width, height);
  }

  private drawDino() {
    const x = Math.floor(this.dino.x);
    const y = Math.floor(this.dino.y);
    
    if (this.dino.ducking) {
      // Dinosaurio agachado
      this.drawPixelRect(x, y + 20, 40, 20, this.colors.dino);
      this.drawPixelRect(x + 5, y + 15, 30, 5, this.colors.dino);
      this.drawPixelRect(x, y + 10, 20, 15, this.colors.dino);
      this.drawPixelRect(x + 2, y + 12, 2, 2, this.colors.background);
    } else {
      // Cuerpo
      this.drawPixelRect(x + 10, y + 10, 15, 25, this.colors.dino);
      
      // Cabeza
      this.drawPixelRect(x + 5, y, 20, 15, this.colors.dino);
      this.drawPixelRect(x + 20, y + 3, 7, 8, this.colors.dino);
      
      // Ojo
      this.drawPixelRect(x + 22, y + 5, 2, 2, this.colors.background);
      
      // Patas animadas
      const legOffset = Math.floor(this.frameCount / 6) % 2 === 0 ? 0 : 2;
      this.drawPixelRect(x + 12, y + 35, 4, 5, this.colors.dino);
      this.drawPixelRect(x + 18 + legOffset, y + 35, 4, 5, this.colors.dino);
      
      // Brazos
      this.drawPixelRect(x + 8, y + 15, 6, 3, this.colors.dino);
      
      // Cola
      this.drawPixelRect(x + 25, y + 20, 8, 4, this.colors.dino);
    }
  }

  private drawGround() {
    this.drawPixelRect(0, this.GROUND_Y, this.CANVAS_WIDTH, 2, this.colors.ground);
    
    // Textura del suelo
    for (let i = 0; i < this.CANVAS_WIDTH; i += 8) {
      if (Math.random() > 0.7) {
        this.drawPixelRect(i + Math.floor(Math.random() * 4), this.GROUND_Y + 3, 1, 1, this.colors.ground);
      }
    }
  }

  private drawClouds() {
    this.clouds.forEach(cloud => {
      this.drawPixelRect(cloud.x, cloud.y, 20, 8, this.colors.cloud);
      this.drawPixelRect(cloud.x + 5, cloud.y - 3, 15, 6, this.colors.cloud);
      this.drawPixelRect(cloud.x + 8, cloud.y - 6, 10, 4, this.colors.cloud);
    });
  }

  private drawObstacles() {
    this.obstacles.forEach(obstacle => {
      if (obstacle.type === 'cactus') {
        const x = Math.floor(obstacle.x);
        const y = Math.floor(obstacle.y);
        
        // Tronco principal
        this.drawPixelRect(x + 5, y, 6, obstacle.height, this.colors.obstacle);
        
        // Brazos del cactus
        if (obstacle.height > 30) {
          this.drawPixelRect(x, y + 10, 8, 4, this.colors.obstacle);
          this.drawPixelRect(x + 8, y + 20, 8, 4, this.colors.obstacle);
        }
        
        // Espinas
        for (let i = 0; i < obstacle.height; i += 8) {
          this.drawPixelRect(x + 3, y + i, 1, 1, this.colors.obstacle);
          this.drawPixelRect(x + 12, y + i + 4, 1, 1, this.colors.obstacle);
        }
      } else if (obstacle.type === 'bird') {
        const x = Math.floor(obstacle.x);
        const y = Math.floor(obstacle.y + Math.sin(this.frameCount * 0.3) * 3);
        
        // Cuerpo
        this.drawPixelRect(x + 2, y + 3, 12, 6, this.colors.obstacle);
        // Cabeza
        this.drawPixelRect(x, y + 2, 6, 4, this.colors.obstacle);
        // Alas animadas
        const wingOffset = Math.floor(this.frameCount / 3) % 2 === 0 ? -2 : 2;
        this.drawPixelRect(x + 4, y + wingOffset, 8, 3, this.colors.obstacle);
        this.drawPixelRect(x + 6, y + 6 + wingOffset, 6, 2, this.colors.obstacle);
      }
    });
  }

  private drawScore() {
    this.ctx.fillStyle = this.colors.obstacle;
    this.ctx.font = '12px monospace';
    this.ctx.fillText(`SCORE: ${this.score.toString().padStart(5, '0')}`, this.CANVAS_WIDTH - 150, 20);
  }

  private updateDino() {
    if (this.dino.jumping) {
      this.dino.velY += 0.6;
      this.dino.y += this.dino.velY;
      
      if (this.dino.y >= this.dino.groundY) {
        this.dino.y = this.dino.groundY;
        this.dino.jumping = false;
        this.dino.velY = 0;
      }
    }
  }

  private updateObstacles() {
    // Mover obstáculos
    this.obstacles.forEach(obstacle => {
      obstacle.x -= this.gameSpeed;
    });
    
    // Remover obstáculos fuera de pantalla
    this.obstacles = this.obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    
    // Generar nuevos obstáculos
    if (this.obstacles.length === 0 || this.obstacles[this.obstacles.length - 1].x < this.CANVAS_WIDTH - 200) {
      if (Math.random() > 0.5) {
        // Cactus
        this.obstacles.push({
          type: 'cactus',
          x: this.CANVAS_WIDTH,
          y: this.GROUND_Y - Math.random() * 20 - 20,
          width: 16,
          height: 30 + Math.random() * 20
        });
      } else {
        // Pájaro
        this.obstacles.push({
          type: 'bird',
          x: this.CANVAS_WIDTH,
          y: this.GROUND_Y - 60 - Math.random() * 40,
          width: 16,
          height: 12
        });
      }
    }
  }

  private updateClouds() {
    // Mover nubes
    this.clouds.forEach(cloud => {
      cloud.x -= this.gameSpeed * 0.3;
    });
    
    // Remover nubes fuera de pantalla
    this.clouds = this.clouds.filter(cloud => cloud.x + 30 > 0);
    
    // Generar nuevas nubes
    if (Math.random() > 0.995) {
      this.clouds.push({
        x: this.CANVAS_WIDTH,
        y: 20 + Math.random() * 50,
      });
    }
  }

  private checkCollisions(): boolean {
    const dinoRect = {
      x: this.dino.x + 5,
      y: this.dino.y + 5,
      width: this.dino.ducking ? 35 : 22,
      height: this.dino.ducking ? 15 : 30
    };
    
    for (let obstacle of this.obstacles) {
      const obstacleRect = {
        x: obstacle.x,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height
      };
      
      if (dinoRect.x < obstacleRect.x + obstacleRect.width &&
          dinoRect.x + dinoRect.width > obstacleRect.x &&
          dinoRect.y < obstacleRect.y + obstacleRect.height &&
          dinoRect.y + dinoRect.height > obstacleRect.y) {
        return true;
      }
    }
    return false;
  }

  private updateScore() {
    if (this.gameRunning) {
      this.score += 1;
      if (this.score % 100 === 0) {
        this.gameSpeed += 0.2;
      }
    }
  }

  private gameLoop = () => {
    if (!this.gameRunning) return;
    
    this.frameCount++;
    
    // Limpiar canvas
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    
    // Actualizar
    this.updateDino();
    this.updateObstacles();
    this.updateClouds();
    this.updateScore();
    
    // Dibujar
    this.drawClouds();
    this.drawGround();
    this.drawObstacles();
    this.drawDino();
    this.drawScore();
    
    // Verificar colisiones
    if (this.checkCollisions()) {
      this.gameOver();
      return;
    }
    
    this.animationId = requestAnimationFrame(this.gameLoop);
  }

  startGame() {
    if (this.gameRunning) return;
    
    this.gameRunning = true;
    this.gameStarted = true;
    this.score = 0;
    this.gameSpeed = 2;
    this.frameCount = 0;
    this.obstacles = [];
    this.clouds = [];
    
    this.dino.y = this.dino.groundY;
    this.dino.velY = 0;
    this.dino.jumping = false;
    this.dino.ducking = false;
    
    this.showGameOver = false;
    
    this.gameLoop();
  }

  private gameOver() {
    this.gameRunning = false;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('dinoHighScore', this.highScore.toString());
    }
    
    this.showGameOver = true;
  }

  restartGame() {
    this.gameRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    setTimeout(() => this.startGame(), 100);
  }

  jump() {
    if (!this.gameStarted) {
      this.startGame();
      return;
    }
    
    if (this.gameRunning && !this.dino.jumping) {
      this.dino.jumping = true;
      this.dino.velY = -12;
      this.dino.ducking = false;
    }
  }

  duck() {
    if (this.gameRunning && !this.dino.jumping) {
      this.dino.ducking = true;
      setTimeout(() => {
        this.dino.ducking = false;
      }, 500);
    }
  }
}