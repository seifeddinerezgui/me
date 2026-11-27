import { Injectable, signal } from '@angular/core';

// SHA-256 hash of the default admin passcode.
// Change passcode from the admin panel, or regenerate this hash and replace it here.
const DEFAULT_HASH = '8813cf532f60b16c0c3de766a6bfa57a915804c2179fd2d9a2b3f5eaf819460d';
const HASH_KEY = 'ser_admin_hash';
const SESSION_KEY = 'ser_admin_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal<boolean>(sessionStorage.getItem(SESSION_KEY) === '1');

  private async sha256(text: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private currentHash(): string {
    return localStorage.getItem(HASH_KEY) ?? DEFAULT_HASH;
  }

  async login(passcode: string): Promise<boolean> {
    const ok = (await this.sha256(passcode)) === this.currentHash();
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, '1');
      this.isAuthenticated.set(true);
    }
    return ok;
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.isAuthenticated.set(false);
  }

  async changePasscode(current: string, next: string): Promise<boolean> {
    if ((await this.sha256(current)) !== this.currentHash()) return false;
    localStorage.setItem(HASH_KEY, await this.sha256(next));
    return true;
  }
}
