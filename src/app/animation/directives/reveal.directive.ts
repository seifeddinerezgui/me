import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { MotionService } from '../services/motion.service';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private cleanup: (() => void) | null = null;

  @Input() appRevealDelay = 0;
  @Input() appRevealY = 46;
  @Input() appRevealClip = true;

  ngAfterViewInit(): void {
    this.cleanup = this.motion.reveal(this.elementRef.nativeElement, {
      delay: this.appRevealDelay,
      y: this.appRevealY,
      clip: this.appRevealClip
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
