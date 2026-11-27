import { Component, input } from '@angular/core';
import { AnimationModule } from '../../../../animation/animation.module';
import { PortfolioData } from '../../../../models/portfolio.model';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [AnimationModule],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss'
})
export class AboutSectionComponent {
  readonly data = input.required<PortfolioData>();
}
