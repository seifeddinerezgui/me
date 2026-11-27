import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimationModule } from '../../../../animation/animation.module';
import { PortfolioData } from '../../../../models/portfolio.model';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink, AnimationModule],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss'
})
export class SiteFooterComponent {
  readonly data = input.required<PortfolioData>();
  readonly year = input.required<number>();
  readonly navigate = output<string>();

  goTo(id: string): void {
    this.navigate.emit(id);
  }
}
