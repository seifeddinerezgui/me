import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input, inject } from '@angular/core';
import { MotionService } from '../../../../animation/services/motion.service';

@Component({
  selector: 'app-site-loader',
  standalone: true,
  templateUrl: './site-loader.component.html',
  styleUrl: './site-loader.component.scss',
  animations: [
    trigger('loaderState', [
      transition(':leave', [
        animate('720ms cubic-bezier(.22,1,.36,1)', style({ opacity: 0, filter: 'blur(18px)' }))
      ])
    ])
  ]
})
export class SiteLoaderComponent implements AfterViewInit, OnDestroy {
  private readonly motion = inject(MotionService);
  private cleanup: (() => void) | null = null;

  readonly name = input.required<string>();
  readonly title = input.required<string>();

  @ViewChild('loadingLine', { static: true })
  private readonly loadingLine?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    if (this.loadingLine) {
      this.cleanup = this.motion.loaderLine(this.loadingLine.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
