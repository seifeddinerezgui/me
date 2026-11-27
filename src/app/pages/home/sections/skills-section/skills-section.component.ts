import { Component, input } from '@angular/core';
import { AnimationModule } from '../../../../animation/animation.module';
import { PortfolioData } from '../../../../models/portfolio.model';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [AnimationModule],
  templateUrl: './skills-section.component.html',
  styleUrl: './skills-section.component.scss'
})
export class SkillsSectionComponent {
  readonly data = input.required<PortfolioData>();
}
