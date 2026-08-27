import { AfterViewInit, Directive, ElementRef, inject, input, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { LuxComponentsConfigParameters } from '../../lux-components-config/lux-components-config-parameters.interface';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxTagIdDirective } from './lux-tag-id.directive';

@Directive({ selector: '[luxCustomTagId]' })
export class LuxCustomTagIdDirective implements AfterViewInit, OnDestroy {
  protected elementRef = inject(ElementRef);
  protected renderer = inject(Renderer2);
  componentsConfigService = inject(LuxComponentsConfigService);

  generateLuxTagIds = false;
  configSubscription: Subscription;

  readonly luxCustomTagId = input<string>();
  readonly luxCustomTagIdSelector = input<string>();

  constructor() {
    this.configSubscription = this.componentsConfigService.config.subscribe((newConfig: LuxComponentsConfigParameters) => {
      this.generateLuxTagIds = newConfig.generateLuxTagIds ?? false;
    });
  }

  ngAfterViewInit(): void {
    if (this.generateLuxTagIds) {
      let el;
      const luxCustomTagIdSelector = this.luxCustomTagIdSelector();
      if (luxCustomTagIdSelector) {
        el = this.elementRef.nativeElement.querySelector(luxCustomTagIdSelector);
      } else {
        el = this.elementRef.nativeElement;
      }

      if (el) {
        this.renderer.setAttribute(el, LuxTagIdDirective.luxTagIdAttrName, this.luxCustomTagId() ?? '');
      }
    }
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }
}
