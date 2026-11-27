import { Component, computed, input } from '@angular/core';
import { AnimationModule } from '../../../../animation/animation.module';
import { PortfolioData, Project } from '../../../../models/portfolio.model';
import { initials } from '../../../../utils/initials';

type DiagramKind = 'api' | 'agent' | 'finance' | 'enterprise';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [AnimationModule],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.scss'
})
export class ProjectsSectionComponent {
  readonly data = input.required<PortfolioData>();
  readonly initials = initials;

  readonly featuredProjects = computed(() => this.data().projects.filter((project) => project.featured));
  readonly otherProjects = computed(() => this.data().projects.filter((project) => !project.featured));

  accentFor(index: number): string {
    return ['#5ee7ff', '#3b82f6', '#d8b45f', '#89f7c4'][index % 4];
  }

  diagramFor(project: Project): DiagramKind {
    if (project.name.includes('AI')) {
      return 'agent';
    }

    if (project.name.includes('Leasing')) {
      return 'finance';
    }

    if (project.name.includes('VERMEG')) {
      return 'enterprise';
    }

    return 'api';
  }
}
