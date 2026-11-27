import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';
import { animate } from 'motion/mini';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export type TextRevealMode = 'lines' | 'words' | 'chars';

export interface RevealOptions {
  y?: number;
  delay?: number;
  duration?: number;
  threshold?: number;
  blur?: number;
  clip?: boolean;
}

export interface TextRevealOptions {
  mode?: TextRevealMode;
  delay?: number;
  stagger?: number;
  yPercent?: number;
}

export interface StaggerOptions {
  selector?: string;
  delay?: number;
  stagger?: number;
  y?: number;
}

type TransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => { finished: Promise<void> };
};

@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT) as TransitionDocument;
  private readonly zone = inject(NgZone);
  private registered = false;

  readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly reducedMotion = signal(false);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion.set(query.matches);

    const updatePreference = (event: MediaQueryListEvent): void => {
      this.reducedMotion.set(event.matches);
    };

    query.addEventListener('change', updatePreference);
    this.destroyRef.onDestroy(() => query.removeEventListener('change', updatePreference));
  }

  reveal(element: HTMLElement, options: RevealOptions = {}): () => void {
    if (!this.isBrowser || this.reducedMotion()) {
      element.classList.add('is-revealed');
      return () => undefined;
    }

    this.register();

    const y = options.y ?? 46;
    const blur = options.blur ?? 14;
    const duration = options.duration ?? 1.05;
    const delay = options.delay ?? 0;
    const threshold = options.threshold ?? 0.16;
    const clipPath = options.clip === false ? 'inset(0% 0 0 0)' : 'inset(12% 0 0 0)';
    let tween: gsap.core.Tween | undefined;

    gsap.set(element, {
      autoAlpha: 0,
      y,
      filter: `blur(${blur}px)`,
      clipPath,
      willChange: 'transform, opacity, filter, clip-path'
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((item) => item.isIntersecting);
        if (!entry) {
          return;
        }

        observer.disconnect();
        this.zone.runOutsideAngular(() => {
          tween = gsap.to(element, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            clipPath: 'inset(0% 0 0 0)',
            duration,
            delay,
            ease: 'power3.out',
            onComplete: () => {
              element.classList.add('is-revealed');
              element.style.willChange = 'auto';
            }
          });
        });
      },
      { threshold, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }

  textReveal(element: HTMLElement, options: TextRevealOptions = {}): () => void {
    if (!this.isBrowser || this.reducedMotion()) {
      element.classList.add('is-revealed');
      return () => undefined;
    }

    this.register();

    const mode = options.mode ?? 'words';
    const split = new SplitType(element, { types: 'lines,words,chars' });
    const targets = this.splitTargets(split, mode);

    if (targets.length === 0) {
      split.revert();
      return () => undefined;
    }

    gsap.set(targets, {
      yPercent: options.yPercent ?? 112,
      autoAlpha: 0,
      rotateX: mode === 'chars' ? -18 : 0,
      filter: 'blur(10px)',
      transformOrigin: '50% 100%',
      willChange: 'transform, opacity, filter'
    });

    const tween = gsap.to(targets, {
      yPercent: 0,
      autoAlpha: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      duration: mode === 'chars' ? 0.84 : 0.96,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? (mode === 'chars' ? 0.018 : 0.055),
      ease: 'power4.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 86%',
        once: true
      },
      onComplete: () => {
        targets.forEach((target) => {
          target.style.willChange = 'auto';
        });
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }

  stagger(parent: HTMLElement, options: StaggerOptions = {}): () => void {
    if (!this.isBrowser || this.reducedMotion()) {
      parent.classList.add('is-revealed');
      return () => undefined;
    }

    this.register();

    const children = Array.from(parent.querySelectorAll<HTMLElement>(options.selector ?? ':scope > *'));
    if (children.length === 0) {
      return this.reveal(parent);
    }

    gsap.set(children, {
      autoAlpha: 0,
      y: options.y ?? 34,
      filter: 'blur(12px)',
      willChange: 'transform, opacity, filter'
    });

    const tween = gsap.to(children, {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.92,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 82%',
        once: true
      },
      onComplete: () => {
        children.forEach((child) => {
          child.style.willChange = 'auto';
        });
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }

  parallax(element: HTMLElement, amount = 22): () => void {
    if (!this.isBrowser || this.reducedMotion() || window.matchMedia('(max-width: 760px)').matches) {
      return () => undefined;
    }

    this.register();

    const tween = gsap.to(element, {
      y: amount,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }

  magnetic(element: HTMLElement, strength = 0.28): () => void {
    if (!this.isBrowser || this.reducedMotion() || window.matchMedia('(pointer: coarse)').matches) {
      return () => undefined;
    }

    const xTo = gsap.quickTo(element, 'x', { duration: 0.52, ease: 'power3.out' });
    const yTo = gsap.quickTo(element, 'y', { duration: 0.52, ease: 'power3.out' });

    const move = (event: PointerEvent): void => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      xTo(x * strength);
      yTo(y * strength);
    };

    const leave = (): void => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);

    return () => {
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      gsap.set(element, { clearProps: 'x,y' });
    };
  }

  tilt(element: HTMLElement, strength = 7): () => void {
    if (!this.isBrowser || this.reducedMotion() || window.matchMedia('(pointer: coarse)').matches) {
      return () => undefined;
    }

    const rotateXTo = gsap.quickTo(element, 'rotateX', { duration: 0.55, ease: 'power3.out' });
    const rotateYTo = gsap.quickTo(element, 'rotateY', { duration: 0.55, ease: 'power3.out' });
    const scaleTo = gsap.quickTo(element, 'scale', { duration: 0.55, ease: 'power3.out' });

    const move = (event: PointerEvent): void => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      rotateYTo(x * strength);
      rotateXTo(y * -strength);
      scaleTo(1.015);
    };

    const leave = (): void => {
      rotateXTo(0);
      rotateYTo(0);
      scaleTo(1);
    };

    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);

    return () => {
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      gsap.set(element, { clearProps: 'rotateX,rotateY,scale' });
    };
  }

  loaderLine(element: HTMLElement): () => void {
    if (!this.isBrowser || this.reducedMotion()) {
      element.style.transform = 'scaleX(1)';
      return () => undefined;
    }

    const controls = animate(
      element,
      { opacity: [0.42, 1], transform: ['scaleX(0)', 'scaleX(1)'] },
      { duration: 1.55, ease: [0.22, 1, 0.36, 1], delay: 0.22 }
    );

    return () => controls.cancel();
  }

  pageIntro(root: HTMLElement): () => void {
    if (!this.isBrowser || this.reducedMotion()) {
      root.classList.add('is-ready');
      return () => undefined;
    }

    this.register();

    const timeline = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onComplete: () => root.classList.add('is-ready')
    });

    timeline
      .fromTo(
        root.querySelectorAll<HTMLElement>('[data-intro]'),
        { y: 34, autoAlpha: 0, filter: 'blur(16px)' },
        { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1.08, stagger: 0.08, delay: 1.58 }
      )
      .fromTo(
        root.querySelectorAll<HTMLElement>('[data-intro-late]'),
        { y: 22, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.86, stagger: 0.06 },
        '-=0.62'
      );

    return () => timeline.kill();
  }

  transition(callback: () => void | Promise<void>): void {
    if (!this.isBrowser || this.reducedMotion() || !this.document.startViewTransition) {
      void callback();
      return;
    }

    void this.document.startViewTransition(callback).finished.catch(() => undefined);
  }

  refresh(): void {
    if (!this.isBrowser) {
      return;
    }

    this.register();
    ScrollTrigger.refresh();
  }

  private register(): void {
    if (this.registered) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.registered = true;
  }

  private splitTargets(split: SplitType, mode: TextRevealMode): HTMLElement[] {
    const targets = mode === 'chars' ? split.chars : mode === 'lines' ? split.lines : split.words;
    return (targets ?? []).filter((target): target is HTMLElement => target instanceof HTMLElement);
  }
}
