import { NgModule } from '@angular/core';
import { MagneticDirective } from './directives/magnetic.directive';
import { ParallaxDirective } from './directives/parallax.directive';
import { RevealDirective } from './directives/reveal.directive';
import { StaggerDirective } from './directives/stagger.directive';
import { TextRevealDirective } from './directives/text-reveal.directive';

const ANIMATION_DIRECTIVES = [
  RevealDirective,
  MagneticDirective,
  ParallaxDirective,
  TextRevealDirective,
  StaggerDirective
] as const;

@NgModule({
  imports: [...ANIMATION_DIRECTIVES],
  exports: [...ANIMATION_DIRECTIVES]
})
export class AnimationModule {}
