import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-snake-arcade',
  imports: [],
  templateUrl: './snake-arcade.component.html',
  styleUrl: './snake-arcade.component.scss'
})
export class SnakeArcadeComponent  implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private gameLoop!: number;
  
  // Configuración del juego
  private readonly GRID_SIZE = 16;
  private readonly CANVAS_SIZE = 320;
  private readonly GRID_COUNT = this.CANVAS_SIZE / this.GRID_SIZE;
  
  // Estado del juego
  gameTitle = 'RETRO SNAKE';
  snake: {x: number, y: number}[] = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = { x: 5, y: 5 };
  score = 0;
  highScore = 0;
  gameRunning = false;
  showGameOver = false;
  
  // Colores
  private colors = {
    snake: '#00ff41',
    food: '#ff0000',
    background: '#001100',
    grid: '#003300'
  };

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
    this.render();
    
    // Auto-start después de 2 segundos
    setTimeout(() => {
      if (!this.gameRunning) {
        this.startGame();
      }
    }, 2000);
  }

  ngOnDestroy() {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
    }
  }

  private drawPixelRect(x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * this.GRID_SIZE, y * this.GRID_SIZE, this.GRID_SIZE, this.GRID_SIZE);
    
    // Efecto pixel con borde
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(x * this.GRID_SIZE, y * this.GRID_SIZE, this.GRID_SIZE, 1);
    this.ctx.fillRect(x * this.GRID_SIZE, y * this.GRID_SIZE, 1, this.GRID_SIZE);
  }

  private drawGrid() {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
    
    // Dibujar grid sutil
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i <= this.GRID_COUNT; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.GRID_SIZE, 0);
      this.ctx.lineTo(i * this.GRID_SIZE, this.CANVAS_SIZE);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.GRID_SIZE);
      this.ctx.lineTo(this.CANVAS_SIZE, i * this.GRID_SIZE);
      this.ctx.stroke();
    }
  }

  private drawSnake() {
    this.snake.forEach((segment, index) => {
      if (index === 0) {
        // Cabeza de la serpiente
        this.drawPixelRect(segment.x, segment.y, this.colors.snake);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(
          segment.x * this.GRID_SIZE + 2, 
          segment.y * this.GRID_SIZE + 2, 
          this.GRID_SIZE - 4, 
          this.GRID_SIZE - 4
        );
      } else {
        this.drawPixelRect(segment.x, segment.y, this.colors.snake);
      }
    });
  }

  private drawFood() {
    const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
    this.ctx.globalAlpha = pulse;
    this.drawPixelRect(this.food.x, this.food.y, this.colors.food);
    
    // Efecto de brillo
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.fillRect(
      this.food.x * this.GRID_SIZE + 4, 
      this.food.y * this.GRID_SIZE + 4, 
      this.GRID_SIZE - 8, 
      this.GRID_SIZE - 8
    );
    this.ctx.globalAlpha = 1;
  }

  private generateFood() {
    this.food = {
      x: Math.floor(Math.random() * this.GRID_COUNT),
      y: Math.floor(Math.random() * this.GRID_COUNT)
    };
    
    if (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y)) {
      this.generateFood();
    }
  }

  private updateGame() {
    if (!this.gameRunning) return;
    
    const head = { 
      x: this.snake[0].x + this.direction.x, 
      y: this.snake[0].y + this.direction.y 
    };
    
    // Verificar colisiones
    if (head.x < 0 || head.x >= this.GRID_COUNT || 
        head.y < 0 || head.y >= this.GRID_COUNT ||
        this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver();
      return;
    }
    
    this.snake.unshift(head);
    
    // Verificar si comió comida
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  private render() {
    this.drawGrid();
    this.drawFood();
    this.drawSnake();
  }

  private GameLoop = () => {
    this.updateGame();
    this.render();
    if (this.gameRunning) {
      setTimeout(() => {
        requestAnimationFrame(this.GameLoop);
      }, 120);
    }
  }

  startGame() {
    if (this.gameRunning) return;
    
    this.snake = [{ x: 10, y: 10 }];
    this.direction = { x: 1, y: 0 };
    this.score = 0;
    this.gameRunning = true;
    this.showGameOver = false;
    
    this.generateFood();
    this.GameLoop();
  }

  restartGame() {
    this.gameRunning = false;
    this.startGame();
  }

  private gameOver() {
    this.gameRunning = false;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
    
    this.showGameOver = true;
  }

  changeDirection(newDirection: string) {
    if (!this.gameRunning && newDirection) {
      this.startGame();
      return;
    }
    
    switch (newDirection) {
      case 'up':
        if (this.direction.y === 0) this.direction = { x: 0, y: -1 };
        break;
      case 'down':
        if (this.direction.y === 0) this.direction = { x: 0, y: 1 };
        break;
      case 'left':
        if (this.direction.x === 0) this.direction = { x: -1, y: 0 };
        break;
      case 'right':
        if (this.direction.x === 0) this.direction = { x: 1, y: 0 };
        break;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.changeDirection('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.changeDirection('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.changeDirection('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.changeDirection('right');
        break;
      case ' ':
        event.preventDefault();
        if (!this.gameRunning) this.startGame();
        break;
    }
  }
}