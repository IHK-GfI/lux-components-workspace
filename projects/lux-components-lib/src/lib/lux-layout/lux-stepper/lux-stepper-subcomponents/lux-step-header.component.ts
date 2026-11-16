import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { LuxComponentsConfigService } from '../../../lux-components-config/lux-components-config.service';

@Component({
  selector: 'lux-step-header',
  template: `
    <div [ngClass]="{ 'lux-uppercase': labelUppercase() }">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class LuxStepHeaderComponent implements OnInit, OnDestroy {
  componentsConfigService = inject(LuxComponentsConfigService);

  readonly labelUppercase = signal(false);

  private configSubscription?: Subscription;

  ngOnInit() {
    this.configSubscription = this.componentsConfigService.config.subscribe(() => {
      this.labelUppercase.set(this.componentsConfigService.isLabelUppercaseForSelector('lux-step'));
    });
  }

  ngOnDestroy() {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
}
