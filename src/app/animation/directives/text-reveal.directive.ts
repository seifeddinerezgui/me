import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { MotionService, TextRevealMode } from '../services/motion.service';

@Directive({
  selector: '[appTextReveal]',
  standalone: true
})
export class TextRevealDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private cleanup: (() => void) | null = null;

  @Input() appTextReveal: TextRevealMode = 'words';
  @Input() appTextRevealDelay = 0;
  @Input() appTextRevealStagger = 0;

  ngAfterViewInit(): void {
    this.cleanup = this.motion.textReveal(this.elementRef.nativeElement, {
      mode: this.appTextReveal || 'words',
      delay: this.appTextRevealDelay,
      stagger: this.appTextRevealStagger || undefined
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
