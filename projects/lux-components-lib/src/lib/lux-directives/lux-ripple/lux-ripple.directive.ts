import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple, RippleGlobalOptions } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';

@Directive({
  selector: '[luxRipple], [lux-ripple]',
  host: {
    class: 'mat-ripple lux-ripple',
    '[class.mat-ripple-unbounded]': 'unbounded'
  }
})
export class LuxRippleDirective extends MatRipple implements OnInit, OnDestroy {
  private configService = inject(LuxComponentsConfigService);
  private luxElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private luxNgZone = inject(NgZone);
  private luxPlatform = inject(Platform);
  private luxGlobalOptions = inject<RippleGlobalOptions>(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
  private luxAnimationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });

  configSubscription: Subscription;

  _luxRippleColor = '';
  _luxRippleUnbounded = false;
  _luxRippleCentered = false;
  _luxRippleDisabled = false;
  _luxRippleRadius = 0;
  _luxRippleEnterDuration = 0;
  _luxRippleExitDuration = 0;

  get luxRippleColor() {
    return this._luxRippleColor;
  }

  @Input() set luxRippleColor(value: string) {
    this._luxRippleColor = value;
    this.color = value;
  }

  get luxRippleUnbounded() {
    return this._luxRippleUnbounded;
  }

  @Input() set luxRippleUnbounded(value: boolean) {
    this._luxRippleUnbounded = value;
    this.unbounded = value;
  }

  get luxRippleCentered() {
    return this._luxRippleCentered;
  }

  @Input() set luxRippleCentered(value: boolean) {
    this._luxRippleCentered = value;
    this.centered = value;
  }

  get luxRippleRadius() {
    return this._luxRippleRadius;
  }

  @Input() set luxRippleRadius(value: number) {
    this._luxRippleRadius = value;
    this.radius = value;
  }

  get luxRippleDisabled() {
    return this._luxRippleDisabled;
  }

  @Input() set luxRippleDisabled(value: boolean) {
    this._luxRippleDisabled = value;
    this.disabled = value;
  }

  get luxRippleEnterDuration() {
    return this._luxRippleEnterDuration;
  }

  @Input() set luxRippleEnterDuration(value: number) {
    this._luxRippleEnterDuration = value;

    if (!this.animation) {
      this.animation = {};
    }
    this.animation.exitDuration = value;
  }

  get luxRippleExitDuration() {
    return this._luxRippleExitDuration;
  }

  @Input() set luxRippleExitDuration(value: number) {
    this._luxRippleExitDuration = value;

    if (!this.animation) {
      this.animation = {};
    }
    this.animation.exitDuration = value;
  }

  constructor() {
    super();

    // Globale Konfiguration für die LUX-Ripples auslesen und die Component entsprechend aktualisieren
    this.configSubscription = this.configService.config.subscribe(({ rippleConfiguration }) => {
      if (rippleConfiguration) {
        this.luxRippleEnterDuration = rippleConfiguration.enterDuration;
        this.luxRippleExitDuration = rippleConfiguration.exitDuration;
        this.luxRippleColor = rippleConfiguration.color ?? '';
        this.luxRippleCentered = rippleConfiguration.centered ?? false;
        this.luxRippleDisabled = rippleConfiguration.disabled ?? false;
        this.luxRippleRadius = rippleConfiguration.radius ?? 0;
        this.luxRippleUnbounded = rippleConfiguration.unbounded ?? false;
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
}
