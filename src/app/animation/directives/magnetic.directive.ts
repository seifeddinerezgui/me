import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, inject } from '@angular/core';
import { CursorService } from '../services/cursor.service';
import { MotionService } from '../services/motion.service';

@Directive({
  selector: '[appMagnetic]',
  standalone: true
})
export class MagneticDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private readonly cursor = inject(CursorService);
  private cleanup: (() => void) | null = null;
  private tiltCleanup: (() => void) | null = null;

  @Input() appMagnetic = 0.28;
  @Input() appMagneticTilt = false;
  @Input() appCursorText = '';

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;
    this.cleanup = this.motion.magnetic(element, Number(this.appMagnetic) || 0.28);

    if (this.appMagneticTilt) {
      this.tiltCleanup = this.motion.tilt(element);
    }
  }

  @HostListener('pointerenter')
  onEnter(): void {
    this.cursor.activate(this.appCursorText);
  }

  @HostListener('pointerleave')
  onLeave(): void {
    this.cursor.reset();
  }

  ngOnDestroy(): void {
    this.cleanup?.();
    this.tiltCleanup?.();
  }
}
