import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { MotionService } from '../services/motion.service';

@Directive({
  selector: '[appStagger]',
  standalone: true
})
export class StaggerDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private cleanup: (() => void) | null = null;

  @Input() appStagger = ':scope > *';
  @Input() appStaggerDelay = 0;
  @Input() appStaggerAmount = 0.08;

  ngAfterViewInit(): void {
    this.cleanup = this.motion.stagger(this.elementRef.nativeElement, {
      selector: this.appStagger || ':scope > *',
      delay: this.appStaggerDelay,
      stagger: this.appStaggerAmount
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
