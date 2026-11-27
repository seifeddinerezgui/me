import { AfterViewInit, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { CursorService } from '../../animation/services/cursor.service';
import { MotionService } from '../../animation/services/motion.service';
import { ScrollService } from '../../animation/services/scroll.service';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioNavComponent } from './components/portfolio-nav/portfolio-nav.component';
import { SiteCursorComponent } from './components/site-cursor/site-cursor.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SiteLoaderComponent } from './components/site-loader/site-loader.component';
import { AboutSectionComponent } from './sections/about-section/about-section.component';
import { ContactSectionComponent } from './sections/contact-section/contact-section.component';
import { EducationSectionComponent } from './sections/education-section/education-section.component';
import { ExperienceSectionComponent } from './sections/experience-section/experience-section.component';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { ProjectsSectionComponent } from './sections/projects-section/projects-section.component';
import { SkillsSectionComponent } from './sections/skills-section/skills-section.component';

@Component({
  selector: 'app-home',
  imports: [
    SiteLoaderComponent,
    SiteCursorComponent,
    PortfolioNavComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    ExperienceSectionComponent,
    ProjectsSectionComponent,
    SkillsSectionComponent,
    EducationSectionComponent,
    ContactSectionComponent,
    SiteFooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  private readonly portfolio = inject(PortfolioService);
  private readonly scroll = inject(ScrollService);
  private readonly cursor = inject(CursorService);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly data = this.portfolio.data;
  readonly year = new Date().getFullYear();
  readonly loaderVisible = signal(true);

  ngAfterViewInit(): void {
    this.scroll.init();
    this.cursor.init();

    const cleanupIntro = this.motion.pageIntro(this.elementRef.nativeElement);
    this.destroyRef.onDestroy(cleanupIntro);

    if (!this.motion.isBrowser) {
      this.loaderVisible.set(false);
      return;
    }

    const timeout = window.setTimeout(
      () => this.loaderVisible.set(false),
      this.motion.reducedMotion() ? 260 : 2280
    );

    this.destroyRef.onDestroy(() => window.clearTimeout(timeout));
  }

  scrollTo(id: string): void {
    this.scroll.scrollTo(id);
  }
}
