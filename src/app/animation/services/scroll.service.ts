import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private lenis: Lenis | null = null;
  private ticker: ((time: number) => void) | null = null;

  init(): void {
    if (!this.isBrowser || this.lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      gsap.registerPlugin(ScrollTrigger);

      this.lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.86,
        touchMultiplier: 1.08,
        smoothWheel: true,
        autoRaf: false
      });

      this.lenis.on('scroll', ScrollTrigger.update);
      this.ticker = (time: number): void => {
        this.lenis?.raf(time * 1000);
      };

      gsap.ticker.add(this.ticker);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add('has-lenis');
    });

    this.destroyRef.onDestroy(() => this.destroy());
  }

  scrollTo(target: string | HTMLElement): void {
    if (!this.isBrowser) {
      return;
    }

    const destination = typeof target === 'string' && !target.startsWith('#') ? `#${target}` : target;

    if (this.lenis) {
      this.lenis.scrollTo(destination, {
        offset: -84,
        duration: 1.18,
        easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time))
      });
      return;
    }

    const element = typeof destination === 'string' ? document.querySelector(destination) : destination;
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  destroy(): void {
    if (this.ticker) {
      gsap.ticker.remove(this.ticker);
      this.ticker = null;
    }

    this.lenis?.destroy();
    this.lenis = null;

    if (this.isBrowser) {
      document.documentElement.classList.remove('has-lenis');
    }
  }
}
