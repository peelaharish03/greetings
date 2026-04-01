import { Component, OnInit, Renderer2, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-celebration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './celebration.component.html',
  styleUrls: ['./celebration.component.css']
})
export class CelebrationComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('thumbnailContainer') thumbnailContainer!: ElementRef;

  images = [
    { src: '/images/couple1.jpeg', alt: 'My Beautiful Zuhi 🥰❤️' },
    { src: '/images/couple2.jpeg', alt: 'You + Me = Forever 👩‍❤️‍👨✨' },
    { src: '/images/couple3.jpeg', alt: 'Two Hearts, One Soul 😘💞' },
    { src: '/images/couple4.jpeg', alt: 'Memories with You = Magic 💖✨' },
    { src: '/images/couple5.jpeg', alt: 'Every Moment Feels Like Love 💕' },
    { src: '/images/couple6.jpeg', alt: 'With You, I Found My Home 🏡❤️' },
    { src: '/images/couple7.jpeg', alt: 'You Are My Happiness 😊💘' },
    { src: '/images/couple8.jpeg', alt: 'Love Looks Perfect on Us 😍💑' },
    { src: '/images/couple9.jpeg', alt: 'Forever Starts With You 💍❤️' },
    { src: '/images/couple10.jpeg', alt: 'My Always & Forever 💞♾️' },
    { src: '/images/couple11.jpeg', alt: 'You Are My Favorite Story 📖❤️' },
    { src: '/images/couple12.jpeg', alt: 'Together is My Favorite Place 🥰✨' },
    { src: '/images/couple13.jpeg', alt: 'Every Frame, Just Love 💖📸' },
    { src: '/images/couple14.jpeg', alt: 'With You, Everything Feels Right ❤️🌹' },
    { src: '/images/couple15.jpeg', alt: 'With You, Everything Feels Right ❤️🌹' },
    { src: '/images/couple16.jpeg', alt: 'With You, Everything Feels Right ❤️🌹' },
    { src: '/images/couple17.jpeg', alt: 'My World...' },
    { src: '/images/couple18s.jpeg', alt: 'My Beautiful Frame...' }
  ];

  currentImageIndex = 0;
  currentVideoIndex = 0;
  isPlaying = false;

  private imageCarouselInterval: any;
  private thumbnailScrollInterval: any;

  constructor(
    private router: Router,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.startImageCarousel();
    this.createConfetti();
  }

  ngAfterViewInit(): void {
    this.initConfettiCanvas();
    this.startThumbnailAutoScroll();
  }

  ngOnDestroy(): void {
    if (this.imageCarouselInterval) {
      clearInterval(this.imageCarouselInterval);
    }

    if (this.thumbnailScrollInterval) {
      clearInterval(this.thumbnailScrollInterval);
    }
  }

  startImageCarousel(): void {
    this.imageCarouselInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.scrollSelectedThumbnailIntoView();
    }, 4000);
  }

  startThumbnailAutoScroll(): void {
    if (!this.thumbnailContainer) return;

    const container = this.thumbnailContainer.nativeElement;

    this.thumbnailScrollInterval = setInterval(() => {
      container.scrollLeft += 1;

      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollLeft = 0;
      }
    }, 30); // smooth slow scrolling
  }

  stopThumbnailAutoScroll(): void {
    if (this.thumbnailScrollInterval) {
      clearInterval(this.thumbnailScrollInterval);
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
    this.scrollSelectedThumbnailIntoView();

    // Stop auto scroll for a few seconds after click
    this.stopThumbnailAutoScroll();

    setTimeout(() => {
      this.startThumbnailAutoScroll();
    }, 3000);
  }

  scrollSelectedThumbnailIntoView(): void {
    setTimeout(() => {
      const container = this.thumbnailContainer?.nativeElement;
      const thumbnails = container?.querySelectorAll('.thumbnail');

      if (thumbnails && thumbnails[this.currentImageIndex]) {
        thumbnails[this.currentImageIndex].scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }, 100);
  }

  createConfetti(): void {
    const colors = ['#ff6b9d', '#d63384', '#ff9a9e', '#fecfef', '#fad0c4'];

    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = this.renderer.createElement('div');
        this.renderer.addClass(confetti, 'confetti');
        this.renderer.setStyle(confetti, 'left', Math.random() * 100 + '%');
        this.renderer.setStyle(confetti, 'background-color', colors[Math.floor(Math.random() * colors.length)]);
        this.renderer.setStyle(confetti, 'animation-delay', Math.random() * 3 + 's');
        this.renderer.setStyle(confetti, 'animation-duration', (3 + Math.random() * 2) + 's');
        this.renderer.appendChild(document.body, confetti);

        setTimeout(() => {
          this.renderer.removeChild(document.body, confetti);
        }, 5000);
      }, i * 50);
    }
  }

  private confettiCanvas: HTMLCanvasElement | null = null;
  private confettiCtx: CanvasRenderingContext2D | null = null;
  private particles: any[] = [];

  initConfettiCanvas(): void {
    this.confettiCanvas = document.querySelector('#confetti-canvas') as HTMLCanvasElement;
    if (this.confettiCanvas) {
      this.confettiCtx = this.confettiCanvas.getContext('2d');
      this.resizeCanvas();
      this.startConfettiAnimation();
    }
  }

  resizeCanvas(): void {
    if (this.confettiCanvas) {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    }
  }

  startConfettiAnimation(): void {
    if (!this.confettiCtx) return;

    const createParticle = () => {
      return {
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 4 + 2,
        color: `hsl(${Math.random() * 60 + 330}, 100%, 70%)`,
        life: 1
      };
    };

    const animate = () => {
      this.confettiCtx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < 3; i++) {
        this.particles.push(createParticle());
      }

      this.particles = this.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1;
        particle.life -= 0.01;

        if (particle.life > 0 && particle.y < window.innerHeight) {
          this.confettiCtx!.beginPath();
          this.confettiCtx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          this.confettiCtx!.fillStyle = particle.color;
          this.confettiCtx!.globalAlpha = particle.life;
          this.confettiCtx!.fill();
          this.confettiCtx!.globalAlpha = 1;
          return true;
        }
        return false;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  selectVideo(index: number): void {
    this.currentVideoIndex = index;
    this.isPlaying = false;
  }

  togglePlay(videoElement: HTMLVideoElement): void {
    if (videoElement.paused) {
      videoElement.play();
      this.isPlaying = true;
    } else {
      videoElement.pause();
      this.isPlaying = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onImageError(event: any): void {
    console.log('Image failed to load:', event.target.src);
    const fallbackSrc = event.target.src.replace('/', '//');
    event.target.src = fallbackSrc;
  }

  onImageLoad(event: any): void {
    console.log('Image loaded successfully:', event.target.src);
  }

  onVideoLoad(event: any): void {
    console.log('Video loaded successfully:', event.target.currentSrc);
  }

  onVideoError(event: any): void {
    console.log('Video failed to load:', event.target.currentSrc);
    console.log('Error details:', event.target.error);
  }
}