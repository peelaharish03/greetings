import { Component, OnInit, OnDestroy, Renderer2, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit, OnDestroy {
 @ViewChild('startNoButton') startNoButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('escapeButton') escapeButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('movementArea') movementAreaRef!: ElementRef<HTMLDivElement>;

  currentButtonText = 'NO';
  isEscapeMode = false;

  noButtonLeft = 0;
  noButtonTop = 0;

  private proximity = 220;
  private isButtonMoving = false;

  private messages = [
    'Think once 🥺',
    "Don't you miss me? 😢",
    'Please think again ❤️',
    'I promise I will make you happy 💕',
    'You are my everything 🥹',
    'My heart says YES already ❤️',
    "Don't break my heart 💔",
    'Say YES please 😭'
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onYesClick(): void {
    this.router.navigate(['/celebration']);
  }

  activateEscapeMode(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isEscapeMode) {
      this.moveButton();
      return;
    }

    const startButton = this.startNoButtonRef?.nativeElement;
    const movementArea = this.movementAreaRef?.nativeElement;

    if (!startButton || !movementArea) return;

    const startRect = startButton.getBoundingClientRect();
    const areaRect = movementArea.getBoundingClientRect();

    this.noButtonLeft = Math.round(startRect.left - areaRect.left);
    this.noButtonTop = Math.round(startRect.top - areaRect.top);

    this.isEscapeMode = true;

    requestAnimationFrame(() => {
      this.moveButton();
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (!this.isEscapeMode || this.isButtonMoving || !this.escapeButtonRef) return;

    const button = this.escapeButtonRef.nativeElement;
    const rect = button.getBoundingClientRect();

    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distance = this.calculateDistance(
      event.clientX,
      event.clientY,
      buttonCenterX,
      buttonCenterY
    );

    if (distance < this.proximity) {
      this.moveButton();
    }
  }

  private moveButton(): void {
    const button = this.escapeButtonRef?.nativeElement;
    const movementArea = this.movementAreaRef?.nativeElement;

    if (!button || !movementArea || this.isButtonMoving) return;

    const areaWidth = movementArea.clientWidth;
    const areaHeight = movementArea.clientHeight;

    const buttonWidth = button.offsetWidth || 200;
    const buttonHeight = button.offsetHeight || 56;

    const minX = 0;
    const minY = 0;
    const maxX = Math.max(0, areaWidth - buttonWidth);
    const maxY = Math.max(0, areaHeight - buttonHeight);

    const currentX = this.noButtonLeft;
    const currentY = this.noButtonTop;

    const yesButton = document.querySelector('.yes-button') as HTMLElement | null;
    let yesRectInArea: { left: number; top: number; right: number; bottom: number } | null = null;

    if (yesButton) {
      const yesRect = yesButton.getBoundingClientRect();
      const areaRect = movementArea.getBoundingClientRect();

      yesRectInArea = {
        left: yesRect.left - areaRect.left,
        top: yesRect.top - areaRect.top,
        right: yesRect.right - areaRect.left,
        bottom: yesRect.bottom - areaRect.top
      };
    }

    let randomX = currentX;
    let randomY = currentY;

    const minDistance = 140;
    const safeGap = 20;
    let attempts = 0;

    do {
      randomX = Math.floor(Math.random() * (maxX + 1));
      randomY = Math.floor(Math.random() * (maxY + 1));
      attempts++;
    } while (
      (
        this.calculateDistance(currentX, currentY, randomX, randomY) < minDistance ||
        this.isOverlappingYesButton(
          randomX,
          randomY,
          buttonWidth,
          buttonHeight,
          yesRectInArea,
          safeGap
        )
      ) &&
      attempts < 150
    );

    randomX = Math.max(minX, Math.min(randomX, maxX));
    randomY = Math.max(minY, Math.min(randomY, maxY));

    this.isButtonMoving = true;
    this.noButtonLeft = randomX;
    this.noButtonTop = randomY;

    const onTransitionEnd = () => {
      this.isButtonMoving = false;
      this.updateButtonText();
      button.removeEventListener('transitionend', onTransitionEnd);
    };

    button.addEventListener('transitionend', onTransitionEnd, { once: true });
  }

  private isOverlappingYesButton(
    x: number,
    y: number,
    width: number,
    height: number,
    yesRect: { left: number; top: number; right: number; bottom: number } | null,
    gap: number
  ): boolean {
    if (!yesRect) return false;

    const noLeft = x - gap;
    const noTop = y - gap;
    const noRight = x + width + gap;
    const noBottom = y + height + gap;

    return !(
      noRight < yesRect.left ||
      noLeft > yesRect.right ||
      noBottom < yesRect.top ||
      noTop > yesRect.bottom
    );
  }

  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private updateButtonText(): void {
    const randomIndex = Math.floor(Math.random() * this.messages.length);
    this.currentButtonText = this.messages[randomIndex];
  }

  ngOnDestroy(): void {}
}
