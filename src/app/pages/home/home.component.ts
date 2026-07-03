import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private portfolio = inject(PortfolioService);

  readonly data = this.portfolio.data;
  readonly year = new Date().getFullYear();

  // flat skill list duplicated for the seamless ticker loop
  readonly tickerItems = computed(() => {
    const items = this.data().skills.flatMap(g => g.items);
    return [...items, ...items];
  });

  readonly featuredProjects = computed(() => this.data().projects.filter(p => p.featured));
  readonly otherProjects = computed(() => this.data().projects.filter(p => !p.featured));

  // cursor spotlight position
  readonly mouseX = signal(-500);
  readonly mouseY = signal(-500);

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);
  }

  initials(name: string): string {
    return name
      .split(/[\s—-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
