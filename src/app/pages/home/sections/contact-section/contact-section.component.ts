import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, input, signal } from '@angular/core';
import { AnimationModule } from '../../../../animation/animation.module';
import { PortfolioData } from '../../../../models/portfolio.model';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [AnimationModule],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss'
})
export class ContactSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly data = input.required<PortfolioData>();
  readonly sent = signal(false);

  submit(form: HTMLFormElement): void {
    if (!this.isBrowser) {
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n');
    const subject = encodeURIComponent(`Portfolio contact - ${name || 'New message'}`);

    window.location.href = `mailto:${this.data().email}?subject=${subject}&body=${encodeURIComponent(body)}`;
    this.sent.set(true);
    form.reset();

    window.setTimeout(() => this.sent.set(false), 2400);
  }
}
