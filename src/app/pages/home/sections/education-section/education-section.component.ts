import { Component, input } from '@angular/core';
import { AnimationModule } from '../../../../animation/animation.module';
import { PortfolioData } from '../../../../models/portfolio.model';

@Component({
  selector: 'app-education-section',
  standalone: true,
  imports: [AnimationModule],
  templateUrl: './education-section.component.html',
  styleUrl: './education-section.component.scss'
})
export class EducationSectionComponent {
  readonly data = input.required<PortfolioData>();
}
