import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PortfolioData } from '../../models/portfolio.model';
import { PortfolioService } from '../../services/portfolio.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private portfolio = inject(PortfolioService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // working copy — only persisted on Save
  draft: PortfolioData = structuredClone(this.portfolio.data());

  readonly savedFlash = signal(false);
  readonly passMsg = signal('');
  currentPass = '';
  newPass = '';

  save(): void {
    this.portfolio.save(this.draft);
    this.savedFlash.set(true);
    setTimeout(() => this.savedFlash.set(false), 2000);
  }

  reset(): void {
    if (!confirm('Reset all content to the built-in defaults? Your saved edits will be lost.')) return;
    this.portfolio.reset();
    this.draft = structuredClone(this.portfolio.data());
  }

  exportJson(): void {
    this.portfolio.save(this.draft);
    this.portfolio.exportJson();
  }

  onImportFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (this.portfolio.importJson(String(reader.result))) {
        this.draft = structuredClone(this.portfolio.data());
      } else {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  async changePass(): Promise<void> {
    if (this.newPass.length < 6) {
      this.passMsg.set('New passcode too short (min 6 chars).');
      return;
    }
    const ok = await this.auth.changePasscode(this.currentPass, this.newPass);
    this.passMsg.set(ok ? 'Passcode updated.' : 'Current passcode incorrect.');
    if (ok) {
      this.currentPass = '';
      this.newPass = '';
    }
  }

  /* ----- list helpers ----- */
  addStat(): void {
    this.draft.stats.push({ value: '', label: '' });
  }

  addExperience(): void {
    this.draft.experiences.unshift({ role: '', company: '', location: '', period: '', bullets: [''] });
  }

  addProject(): void {
    this.draft.projects.unshift({ name: '', description: '', tech: [], featured: false });
  }

  addEducation(): void {
    this.draft.education.push({ degree: '', school: '', location: '', period: '', details: '' });
  }

  addSkillGroup(): void {
    this.draft.skills.push({ category: '', items: [] });
  }

  addLanguage(): void {
    this.draft.languages.push({ name: '', level: '' });
  }

  removeAt<T>(arr: T[], index: number): void {
    arr.splice(index, 1);
  }

  moveUp<T>(arr: T[], index: number): void {
    if (index === 0) return;
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
  }

  /* image file → base64 data URL stored on the object (logos, profile photo) */
  onImageFile(holder: object, key: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 400 * 1024) {
      alert('Image too large (max 400 KB). Use a smaller/compressed image.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      (holder as Record<string, unknown>)[key] = String(reader.result);
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  clearImage(holder: object, key: string): void {
    (holder as Record<string, unknown>)[key] = undefined;
  }

  /* newline-joined textarea binding for bullets */
  bulletsText(exp: { bullets: string[] }): string {
    return exp.bullets.join('\n');
  }

  setBullets(exp: { bullets: string[] }, text: string): void {
    exp.bullets = text.split('\n').filter(line => line.trim().length > 0);
  }

  /* comma-joined input binding for string arrays */
  listText(items: string[]): string {
    return items.join(', ');
  }

  setList(holder: object, key: string, text: string): void {
    (holder as Record<string, unknown>)[key] = text
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
}
