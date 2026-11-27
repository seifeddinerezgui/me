import { Component, computed, input, output } from '@angular/core';
import { AnimationModule } from '../../../../animation/animation.module';
import { PortfolioData } from '../../../../models/portfolio.model';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [AnimationModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  readonly data = input.required<PortfolioData>();
  readonly navigate = output<string>();

  readonly tickerItems = computed(() => {
    const items = this.data().skills.flatMap((group) => group.items);
    return [...items, ...items];
  });

  readonly heroInterests = computed(() => this.data().interests.slice(0, 3));

  goTo(id: string): void {
    this.navigate.emit(id);
  }
}
