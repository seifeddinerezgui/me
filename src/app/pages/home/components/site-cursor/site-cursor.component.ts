import { Component, computed, inject } from '@angular/core';
import { CursorService } from '../../../../animation/services/cursor.service';

@Component({
  selector: 'app-site-cursor',
  standalone: true,
  templateUrl: './site-cursor.component.html',
  styleUrl: './site-cursor.component.scss'
})
export class SiteCursorComponent {
  readonly cursor = inject(CursorService);

  readonly transform = computed(() => {
    const x = this.cursor.x() - 12;
    const y = this.cursor.y() - 12;
    return `translate3d(${x}px, ${y}px, 0)`;
  });
}
