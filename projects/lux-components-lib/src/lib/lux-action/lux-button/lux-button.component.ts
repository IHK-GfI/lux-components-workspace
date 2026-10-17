import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  OnInit,
  inject,
  input,
  output
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { LuxProgressComponent, LuxProgressModeType } from '../../lux-common/lux-progress/lux-progress.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaDisabledDirective } from '../../lux-directives/lux-aria/lux-aria-disabled.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxActionComponentBaseClass } from '../lux-action-model/lux-action-component-base.class';

@Component({
  selector: 'lux-button',
  templateUrl: './lux-button.component.html',
  styleUrls: ['./lux-button.component.scss'],
  imports: [
    MatButton,
    LuxAriaDisabledDirective,
    LuxTagIdDirective,
    NgClass,
    NgTemplateOutlet,
    MatFabButton,
    MatIconButton,
    LuxIconComponent,
    LuxProgressComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lux-flat]': 'luxFlat()',
    '[class.lux-raised]': 'luxRaised()',
    '[class.lux-rounded]': 'luxRounded()',
    '[class.lux-stroked]': 'luxStroked()',
    '[class.lux-icon-button]': 'luxIconButton()'
  }
})
export class LuxButtonComponent extends LuxActionComponentBaseClass implements OnInit {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  elementRef = inject(ElementRef);
  componentsConfigService = inject(LuxComponentsConfigService);
  tooltipDirective?: LuxTooltipDirective;

  private clickSubject = new Subject<MouseEvent>();
  private auxClickSubject = new Subject<MouseEvent>();
  private clickNotAllowedSubject = new Subject<MouseEvent>();
  readonly luxType = input<'button' | 'reset' | 'submit'>('button');
  readonly luxThrottleTime = input<number | undefined>(undefined);
  readonly luxButtonBadge = input<string | undefined>(undefined);
  readonly luxButtonBadgeColor = input<LuxThemePalette>('primary');
  readonly luxSpinnerMode = input<LuxProgressModeType>('indeterminate');
  readonly luxSpinnerValue = input(70);
  readonly luxLoading = input(false);
  readonly luxIconButton = input(false);

  luxAuxClicked = output<Event>();
  luxClickNotAllowed = output<Event>();

  @HostBinding('class.lux-uppercase') labelUppercase!: boolean;

  ngOnInit() {
    const throttleTimeMs = this.resolveThrottleTime();

    if (
      (this.luxRaised() && this.luxFlat()) ||
      (this.luxRaised() && this.luxStroked()) ||
      (this.luxStroked() && this.luxFlat()) ||
      (this.luxIconButton() && (this.luxRaised() || this.luxFlat() || this.luxStroked() || this.luxRounded()))
    ) {
      console.log(
        'Es kann nur eine Button-Variante gesetzt werden!',
        'luxRaised: ',
        this.luxRaised(),
        'luxFlat: ',
        this.luxFlat(),
        'luxStroked: ',
        this.luxStroked(),
        'luxRounded: ',
        this.luxRounded(),
        'luxIconButton: ',
        this.luxIconButton()
      );
    }

    this.componentsConfigService.config.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Hintergrund: LuxLink, LuxSideNavItem und LuxMenuItem benutzen alle unter der Haube
      // den LuxButton. Wenn diese nun als Ausnahmen für Uppercase in der Config eingetragen werden,
      // darf eine Uppercase-Einstellung für den LuxButton diese nicht überschreiben.
      // Deshalb prüft der LuxButton hier, ob er Teil einer dieser Komponenten ist.
      this.detectParent();
      this.cdr.markForCheck();
    });

    this.clickSubject.pipe(throttleTime(throttleTimeMs), takeUntilDestroyed(this.destroyRef)).subscribe((e) => this.luxClicked.emit(e));

    this.auxClickSubject
      .pipe(throttleTime(throttleTimeMs), takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => this.luxAuxClicked.emit(e));

    this.clickNotAllowedSubject
      .pipe(throttleTime(throttleTimeMs), takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => this.luxClickNotAllowed.emit(e));
  }

  clicked(event: MouseEvent) {
    if (this.shouldHandleNotAllowedClick()) {
      this.emitClickNotAllowed(event);
      return;
    }

    this.clickSubject.next(event);
  }

  auxClicked(event: MouseEvent) {
    if (this.shouldHandleNotAllowedClick()) {
      this.emitClickNotAllowed(event);
      return;
    }

    this.auxClickSubject.next(event);
  }

  private detectParent() {
    const className = this.elementRef.nativeElement.className;

    let selector;
    if (className.indexOf('lux-link') > -1) {
      selector = 'lux-link';
    } else if (className.indexOf('lux-side-nav-item-button') > -1) {
      selector = 'lux-side-nav-item';
    } else if (className.indexOf('lux-menu-item') > -1) {
      selector = 'lux-menu-item';
    } else {
      selector = 'lux-button';
    }

    this.labelUppercase = this.componentsConfigService.isLabelUppercaseForSelector(selector);
  }

  private shouldHandleNotAllowedClick(): boolean {
    return !!this.luxDisabledAria() && !this.luxDisabled();
  }

  private emitClickNotAllowed(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.clickNotAllowedSubject.next(event);
  }

  private resolveThrottleTime(): number {
    return (
      this.luxThrottleTime() ||
      this.componentsConfigService.currentConfig.buttonConfiguration?.throttleTimeMs ||
      LuxComponentsConfigService.DEFAULT_CONFIG.buttonConfiguration.throttleTimeMs
    );
  }
}
