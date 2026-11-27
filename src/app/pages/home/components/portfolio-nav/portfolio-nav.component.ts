import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { AnimationModule } from '../../../../animation/animation.module';

interface NavItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-portfolio-nav',
  standalone: true,
  imports: [AnimationModule],
  templateUrl: './portfolio-nav.component.html',
  styleUrl: './portfolio-nav.component.scss'
})
export class PortfolioNavComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private lastY = 0;

  readonly name = input.required<string>();
  readonly navigate = output<string>();
  readonly scrolled = signal(false);
  readonly hidden = signal(false);
  readonly activeId = signal('hero');
  readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((part) => part[0].toUpperCase())
      .join('')
  );

  readonly items: NavItem[] = [
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.lastY = window.scrollY;

    const updateNav = (): void => {
      const nextY = window.scrollY;
      this.scrolled.set(nextY > 12);
      this.hidden.set(nextY > this.lastY && nextY > 160);
      this.lastY = nextY;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          this.activeId.set(visible.target.id);
        }
      },
      { rootMargin: '-24% 0px -58% 0px', threshold: [0.08, 0.2, 0.36] }
    );

    ['hero', ...this.items.map((item) => item.id)].forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', updateNav);
      observer.disconnect();
    });
  }

  goTo(id: string): void {
    this.navigate.emit(id);
  }
}
