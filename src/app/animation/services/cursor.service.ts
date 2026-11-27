import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CursorService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private initialized = false;
  private frame = 0;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;

  readonly enabled = signal(false);
  readonly visible = signal(false);
  readonly active = signal(false);
  readonly text = signal('');
  readonly x = signal(0);
  readonly y = signal(0);

  init(): void {
    if (
      !this.isBrowser ||
      this.initialized ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    this.initialized = true;
    this.enabled.set(true);

    const move = (event: PointerEvent): void => {
      this.targetX = event.clientX;
      this.targetY = event.clientY;
      this.visible.set(true);
    };

    const leave = (): void => this.visible.set(false);
    const enter = (): void => this.visible.set(true);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave);
    window.addEventListener('pointerenter', enter);

    this.zone.runOutsideAngular(() => {
      const render = (): void => {
        this.currentX += (this.targetX - this.currentX) * 0.18;
        this.currentY += (this.targetY - this.currentY) * 0.18;
        this.x.set(this.currentX);
        this.y.set(this.currentY);
        this.frame = window.requestAnimationFrame(render);
      };

      this.frame = window.requestAnimationFrame(render);
    });

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerenter', enter);
      window.cancelAnimationFrame(this.frame);
    });
  }

  activate(label = ''): void {
    if (!this.enabled()) {
      return;
    }

    this.text.set(label);
    this.active.set(true);
  }

  reset(): void {
    this.text.set('');
    this.active.set(false);
  }
}
