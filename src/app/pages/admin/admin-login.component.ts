import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-wrap">
      <form class="login-card" (ngSubmit)="submit()">
        <p class="mono kicker">// owner access only</p>
        <h2>Admin<span class="accent">_</span></h2>
        <input
          type="password"
          name="passcode"
          [(ngModel)]="passcode"
          placeholder="Passcode"
          autocomplete="current-password"
          autofocus
        />
        @if (error()) {
          <p class="error mono">access denied</p>
        }
        <button type="submit" class="btn-primary">Unlock</button>
        <a routerLink="/" class="back mono">← back to portfolio</a>
      </form>
    </div>
  `,
  styles: `
    .login-wrap {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
    }
    .login-card {
      width: 100%;
      max-width: 360px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: var(--panel);
      padding: 2.2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .kicker { color: var(--accent); font-size: 0.8rem; }
    h2 { font-size: 1.6rem; }
    input {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 0.75rem 1rem;
      color: var(--text);
      font-size: 1rem;
    }
    input:focus { outline: none; border-color: var(--accent); }
    .error { color: #ff5470; font-size: 0.8rem; }
    .btn-primary {
      background: var(--accent);
      color: var(--bg);
      border: none;
      border-radius: 10px;
      padding: 0.75rem;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
    }
    .btn-primary:hover { background: var(--accent-bright); }
    .back { color: var(--muted); font-size: 0.78rem; text-decoration: none; text-align: center; }
    .back:hover { color: var(--accent); }
  `
})
export class AdminLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  passcode = '';
  readonly error = signal(false);

  async submit(): Promise<void> {
    if (await this.auth.login(this.passcode)) {
      this.router.navigate(['/admin']);
    } else {
      this.error.set(true);
      this.passcode = '';
    }
  }
}
