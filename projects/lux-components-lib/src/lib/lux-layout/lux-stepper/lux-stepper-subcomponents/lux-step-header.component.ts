import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LuxComponentsConfigService } from '../../../lux-components-config/lux-components-config.service';

@Component({
  selector: 'lux-step-header',
  template: `
    <div [ngClass]="{ 'lux-uppercase': labelUppercase }">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class LuxStepHeaderComponent implements OnInit, OnDestroy {
  componentsConfigService = inject(LuxComponentsConfigService);
  private cdr = inject(ChangeDetectorRef);

  private configSubscription?: Subscription;

  labelUppercase?: boolean;

  ngOnInit() {
    this.configSubscription = this.componentsConfigService.config.subscribe(() => {
      this.labelUppercase = this.componentsConfigService.isLabelUppercaseForSelector('lux-step');
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
}
