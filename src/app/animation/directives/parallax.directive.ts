import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { MotionService } from '../services/motion.service';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private cleanup: (() => void) | null = null;

  @Input() appParallax = 22;

  ngAfterViewInit(): void {
    this.cleanup = this.motion.parallax(this.elementRef.nativeElement, Number(this.appParallax) || 22);
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
