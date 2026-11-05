import { Platform } from '@angular/cdk/platform';
import { Directive, effect, ElementRef, inject, input, NgZone } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple, RippleGlobalOptions } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';

@Directive({
  selector: '[luxRipple], [lux-ripple]',
  host: {
    class: 'mat-ripple lux-ripple',
    '[class.mat-ripple-unbounded]': 'unbounded'
  }
})
export class LuxRippleDirective extends MatRipple {
  private configService = inject(LuxComponentsConfigService);
  private luxElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private luxNgZone = inject(NgZone);
  private luxPlatform = inject(Platform);
  private luxGlobalOptions = inject<RippleGlobalOptions>(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
  private luxAnimationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });

  private readonly config = toSignal(this.configService.config, { requireSync: true });

  readonly luxRippleColor = input<string>();
  readonly luxRippleUnbounded = input<boolean>();
  readonly luxRippleCentered = input<boolean>();
  readonly luxRippleDisabled = input<boolean>();
  readonly luxRippleRadius = input<number>();
  readonly luxRippleEnterDuration = input<number>();
  readonly luxRippleExitDuration = input<number>();

  constructor() {
    super();

    // Die globale Konfiguration liefert die Default-Werte für die LUX-Ripple; ein gesetzter
    // Input überschreibt den jeweiligen Default-Wert.
    effect(() => {
      const rippleConfiguration = this.config().rippleConfiguration;

      this.color = this.luxRippleColor() ?? rippleConfiguration?.color ?? '';
      this.unbounded = this.luxRippleUnbounded() ?? rippleConfiguration?.unbounded ?? false;
      this.centered = this.luxRippleCentered() ?? rippleConfiguration?.centered ?? false;
      this.disabled = this.luxRippleDisabled() ?? rippleConfiguration?.disabled ?? false;
      this.radius = this.luxRippleRadius() ?? rippleConfiguration?.radius ?? 0;

      if (!this.animation) {
        this.animation = {};
      }
      // Hinweis: sowohl luxRippleEnterDuration als auch luxRippleExitDuration wirken sich
      // (wie zuvor) nur auf animation.exitDuration aus.
      this.animation.exitDuration = this.luxRippleEnterDuration() ?? rippleConfiguration?.enterDuration;
      this.animation.exitDuration = this.luxRippleExitDuration() ?? rippleConfiguration?.exitDuration ?? this.animation.exitDuration;
    });
  }
}
