import { Component, input } from '@angular/core';
import { AnimationModule } from '../../../../animation/animation.module';
import { PortfolioData } from '../../../../models/portfolio.model';
import { initials } from '../../../../utils/initials';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [AnimationModule],
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.scss'
})
export class ExperienceSectionComponent {
  readonly data = input.required<PortfolioData>();
  readonly initials = initials;

  logoFor(company: string): string | null {
    if (company.includes('Attijari')) {
      return 'assets/logos/attijari_leasing.png';
    }

    if (company.includes('VERMEG')) {
      return 'assets/logos/vermeg.png';
    }

    return null;
  }
}
