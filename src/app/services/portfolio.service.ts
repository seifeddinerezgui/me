import { Injectable, signal } from '@angular/core';
import { PortfolioData } from '../models/portfolio.model';
import { DEFAULT_PORTFOLIO } from '../data/default-portfolio';

const STORAGE_KEY = 'ser_portfolio_data';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  readonly data = signal<PortfolioData>(this.load());

  private load(): PortfolioData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // merge over defaults so new fields added in code still appear
        return { ...structuredClone(DEFAULT_PORTFOLIO), ...JSON.parse(raw) };
      }
    } catch {
      // corrupted storage — fall back to defaults
    }
    return structuredClone(DEFAULT_PORTFOLIO);
  }

  save(updated: PortfolioData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    this.data.set(structuredClone(updated));
  }

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.data.set(structuredClone(DEFAULT_PORTFOLIO));
  }

  exportJson(): void {
    const blob = new Blob([JSON.stringify(this.data(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importJson(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed !== 'object' || parsed === null || typeof parsed.name !== 'string') {
        return false;
      }
      this.save({ ...structuredClone(DEFAULT_PORTFOLIO), ...parsed });
      return true;
    } catch {
      return false;
    }
  }
}
