import { ChangeDetectionStrategy, Component, OnInit, input } from '@angular/core';

@Component({
  selector: 'lux-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<span [id]="luxId()"><ng-content /></span>'
})
export class LuxLabelComponent implements OnInit {
  readonly luxId = input<string | undefined>(undefined);

  ngOnInit() {
    if (!this.luxId()) {
      console.warn('lux-label -> The property "luxId" is missing.');
    }
  }
}
