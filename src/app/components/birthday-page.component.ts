import { Component, OnInit, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService, BirthdayConfig } from '../services/config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-birthday-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './birthday-page.component.html',
  styleUrls: ['./birthday-page.component.css']
})
export class BirthdayPageComponent implements OnInit, OnDestroy, AfterViewInit {
  config: BirthdayConfig | null = null;
  currentImageIndex = 0;
  isLoading = false; // Start with false to show content immediately
  showAnimation = false;
  audio: HTMLAudioElement | null = null;
  private configSubscription: Subscription | null = null;
  private imageInterval: any = null;
  private fireworksCanvas: HTMLCanvasElement | null = null;
  private fireworksCtx: CanvasRenderingContext2D | null = null;
  private fireworks: any[] = [];

  constructor(
    private configService: ConfigService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    console.log('BirthdayPageComponent ngOnInit called');
    
    // Get config immediately
    this.config = this.configService.getCurrentConfig();
    console.log('Config loaded:', this.config);
    
    // Start animations immediately
    setTimeout(() => {
      this.showAnimation = true;
      this.startAnimations();
    }, 500);
  }

  ngAfterViewInit(): void {
    this.initFireworks();
    this.initAudio();
  }

  ngOnDestroy(): void {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
    if (this.audio) {
      this.audio.pause();
    }
  }

  startAnimations(): void {
    console.log('Starting animations');
    this.startImageCarousel();
    this.startFireworks();
    this.createConfetti();
  }

  startImageCarousel(): void {
    if (!this.config || this.config.personImages.length <= 1) return;
    
    console.log('Starting image carousel with images:', this.config.personImages);
    
    this.imageInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.config!.personImages.length;
      console.log('Current image index:', this.currentImageIndex, 'Image:', this.config!.personImages[this.currentImageIndex]);
    }, 3000);
  }

  initAudio(): void {
    if (!this.config || !this.config.backgroundMusic) return;
    
    this.audio = new Audio(this.config.backgroundMusic);
    this.audio.loop = true;
    this.audio.volume = 0.3;
    
    // Handle autoplay policy
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented, we can add a play button if needed
      });
    }
  }

  initFireworks(): void {
    setTimeout(() => {
      const canvas = document.querySelector('#fireworks-canvas') as HTMLCanvasElement;
      if (canvas) {
        this.fireworksCanvas = canvas;
        this.fireworksCtx = canvas.getContext('2d');
        
        if (this.fireworksCtx) {
          this.resizeFireworksCanvas();
          window.addEventListener('resize', () => this.resizeFireworksCanvas());
        }
      }
    }, 100);
  }

  resizeFireworksCanvas(): void {
    if (this.fireworksCanvas) {
      this.fireworksCanvas.width = window.innerWidth;
      this.fireworksCanvas.height = window.innerHeight;
    }
  }

  startFireworks(): void {
    if (!this.fireworksCtx) return;
    
    const animate = () => {
      // Semi-transparent overlay for trail effect
      this.fireworksCtx!.fillStyle = 'rgba(0, 0, 0, 0.05)';
      this.fireworksCtx!.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Create more frequent fireworks
      if (Math.random() < 0.08) {
        this.createFirework();
      }
      
      // Create burst crackers
      if (Math.random() < 0.03) {
        this.createBurstCracker();
      }
      
      // Update and draw all particles
      this.updateAndDrawParticles();
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  createFirework(): void {
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight;
    const targetY = Math.random() * window.innerHeight * 0.5;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    
    // Launch firework
    this.fireworks.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: -15 - Math.random() * 5,
      color: color,
      life: 100,
      type: 'launch'
    });
  }

  createBurstCracker(): void {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.6;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    
    // Create explosion burst
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 5 + Math.random() * 5;
      
      this.fireworks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: color,
        life: 60,
        type: 'burst'
      });
    }
  }

  updateAndDrawParticles(): void {
    this.fireworks = this.fireworks.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      
      // Apply gravity
      particle.vy += 0.1;
      
      if (particle.life > 0) {
        this.fireworksCtx!.beginPath();
        
        if (particle.type === 'launch') {
          // Draw launch trail
          this.fireworksCtx!.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          this.fireworksCtx!.fillStyle = particle.color;
          this.fireworksCtx!.fill();
          
          // Add sparkle trail
          this.fireworksCtx!.arc(particle.x - particle.vx * 2, particle.y - particle.vy * 2, 2, 0, Math.PI * 2);
          this.fireworksCtx!.fillStyle = `${particle.color}88`;
          this.fireworksCtx!.fill();
        } else if (particle.type === 'burst') {
          // Draw burst particles
          const size = 2 + (60 - particle.life) / 20;
          this.fireworksCtx!.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          this.fireworksCtx!.fillStyle = particle.color;
          this.fireworksCtx!.fill();
          
          // Add glow effect
          this.fireworksCtx!.shadowBlur = 10;
          this.fireworksCtx!.shadowColor = particle.color;
          this.fireworksCtx!.fill();
          this.fireworksCtx!.shadowBlur = 0;
        }
        
        return true;
      }
      return false;
    });
  }

  createConfetti(): void {
    const colors = ['#ff4081', '#ff9a9e', '#fad0c4', '#ffeb3b', '#4caf50'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = this.renderer.createElement('div');
      this.renderer.addClass(confetti, 'confetti');
      this.renderer.setStyle(confetti, 'left', Math.random() * 100 + '%');
      this.renderer.setStyle(confetti, 'background-color', colors[Math.floor(Math.random() * colors.length)]);
      this.renderer.setStyle(confetti, 'animation-delay', Math.random() * 3 + 's');
      this.renderer.appendChild(document.body, confetti);
      
      setTimeout(() => {
        this.renderer.removeChild(document.body, confetti);
      }, 5000);
    }
  }

  replayAnimation(): void {
    this.showAnimation = false;
    this.currentImageIndex = 0;
    setTimeout(() => {
      this.showAnimation = true;
      this.startAnimations();
    }, 100);
  }

  shareLink(): void {
    if (navigator.share) {
      navigator.share({
        title: `Birthday Wishes for ${this.config?.personName}`,
        text: this.config?.mainMessage,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }

  toggleMusic(): void {
    if (this.audio) {
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
  }

  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    console.error('Error details:', event);
  }

  onImageLoad(event: any): void {
    console.log('Image loaded successfully:', event.target.src);
  }
}
