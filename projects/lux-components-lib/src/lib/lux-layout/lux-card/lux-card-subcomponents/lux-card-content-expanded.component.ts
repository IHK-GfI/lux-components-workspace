import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-card-content-expanded',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    // Angulars (animate.leave) beendet das Zuklappen beim ersten animationend am Container, auch wenn es aus dem Inhalt stammt.
    '(animationend)': '$event.stopPropagation()'
  }
})
export class LuxCardContentExpandedComponent {}
