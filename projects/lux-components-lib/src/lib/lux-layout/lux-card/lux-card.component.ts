import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AfterViewInit,
  AnimationCallbackEvent,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Injector,
  afterNextRender,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  model,
  output
} from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigParameters } from '../../lux-components-config/lux-components-config-parameters.interface';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { luxOutputObserved } from '../../lux-util/lux-output-observed';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxCardActionsComponent } from './lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentExpandedComponent } from './lux-card-subcomponents/lux-card-content-expanded.component';
import { LuxCardContentComponent } from './lux-card-subcomponents/lux-card-content.component';
import { LuxCardCustomHeaderComponent } from './lux-card-subcomponents/lux-card-custom-header.component';
import { LuxCardHeadingComponent } from './lux-card-subcomponents/lux-card-heading.component';
import { LuxCardInfoComponent } from './lux-card-subcomponents/lux-card-info.component';

@Component({
  selector: 'lux-card',
  templateUrl: './lux-card.component.html',
  imports: [
    MatCard,
    LuxTagIdDirective,
    NgClass,
    MatCardContent,
    MatCardActions,
    LuxButtonComponent,
    TranslocoPipe,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    LuxCardHeadingComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lux-flex'
  }
})
export class LuxCardComponent implements AfterViewInit {
  readonly luxTitle = input<string | undefined>();
  readonly luxTitleTooltip = input<string | undefined>();
  readonly luxSubTitle = input<string | undefined>();
  readonly luxSubTitleTooltip = input<string | undefined>();
  readonly luxDisabled = input<boolean | undefined>();
  readonly luxTagId = input<string | undefined>();
  readonly luxTitleLineBreak = input(true);
  readonly luxUseTabIndex = input(true);
  readonly luxHeading = input(2);
  readonly luxExpandedLabelOpen = input('');
  readonly luxExpandedLabelClose = input('');
  readonly luxExpanded = model(false);

  readonly luxAfterExpansion = output<void>();
  readonly luxClicked = output<Event>();

  readonly iconComponents = contentChildren(LuxIconComponent, { descendants: false });
  readonly actionsComponent = contentChild(LuxCardActionsComponent);
  readonly infoComponent = contentChild(LuxCardInfoComponent);
  readonly contentExpandedComponent = contentChild(LuxCardContentExpandedComponent);
  readonly contentComponent = contentChild(LuxCardContentComponent);
  readonly customHeaderComponent = contentChild(LuxCardCustomHeaderComponent);

  animationDisabled = true;

  get showButtons() {
    return !!this.actionsComponent();
  }

  get showIcon() {
    return this.iconComponents().length === 1;
  }

  get showExpandedToggle() {
    return !!this.contentExpandedComponent();
  }

  /**
   * Header wird nur angezeigt, wenn wenigstens eines der Header-Elemente vorhanden ist
   * (Icon, Title, Subtitle, Info-Komponente).
   */
  get showHeader() {
    const luxTitle = this.luxTitle();
    const luxSubTitle = this.luxSubTitle();
    return this.showIcon || !!(luxTitle && luxTitle.length > 0) || !!(luxSubTitle && luxSubTitle.length > 0) || !!this.infoComponent();
  }

  private componentsConfigService = inject(LuxComponentsConfigService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);
  private initialRenderDone = false;

  readonly effectiveTagId = computed(() => this.luxTagId() || this.luxTitle());
  // Steuert die Klickbar-Darstellung der Card (Cursor, Tabindex).
  protected readonly luxClickedObserved = luxOutputObserved(this.luxClicked);

  ngAfterViewInit() {
    // Über die Konfiguration abfragen, ob die Animationen für Cards deaktiviert sind.
    this.componentsConfigService.config.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((config: LuxComponentsConfigParameters) => {
      this.animationDisabled = !config.cardExpansionAnimationActive;
      this.cdr.markForCheck();
    });

    // Die read-Phase läuft nach Angulars Enter-Animationen (mixedReadWrite). So gilt eine initial
    // aufgeklappte Karte während ihres ersten Renderns noch nicht als animierbar.
    afterNextRender({ read: () => (this.initialRenderDone = true) }, { injector: this.injector });
  }

  changeContentExpansion(event: any) {
    LuxUtil.stopEventPropagation(event);

    this.luxExpanded.update((expanded) => !expanded);
  }

  clicked(event: Event) {
    if (!this.luxDisabled() && !this.showButtons) {
      this.luxClicked.emit(event);
    }
  }

  /**
   * setzt das korrekte Alignment der Titelzeile. Ist der Titel im Zweifel mehrzeilig, so wird das Icon
   * im Titel nach oben ausgerichtet, damit es nicht mittig neben dem Titel schwebt. Ist der Titel aber
   * einzeilig, so wird das Icon vertikal zum Titel ausgerichtet.
   */
  getTitleAlignment(): string {
    if (this.luxTitleLineBreak() && this.showIcon) {
      return 'left top';
    }

    return 'left center';
  }

  /**
   * Gibt die Dauer der Animation abhängig davon, ob sie via Config deaktiviert wurden oder nicht zurück.
   */
  getAnimDuration() {
    return this.animationDisabled || !this.initialRenderDone ? 0 : 300;
  }

  /**
   * Animiert das Ein- bzw. Ausklappen des erweiterten Karteninhalts (Höhe und Deckkraft).
   * Die Höhe wird per Web Animations API aus der gemessenen Inhaltshöhe berechnet, weil CSS allein
   * nicht zuverlässig von bzw. auf `height: auto` animieren kann.
   * Ohne Animation (Config, prefers-reduced-motion, fehlende API) wird sofort abgeschlossen.
   */
  animateExpansion(event: AnimationCallbackEvent, expanding: boolean) {
    const element = event.target as HTMLElement;
    const duration = this.getAnimDuration();

    if (duration === 0 || typeof element.animate !== 'function' || this.prefersReducedMotion()) {
      this.finishExpansion(event);
      return;
    }

    // offsetHeight statt getBoundingClientRect(), weil CSS-Transforms von Vorfahren die Höhe sonst verfälschen.
    const expandedFrame = { height: `${element.offsetHeight}px`, opacity: 1, overflow: 'hidden' };
    const collapsedFrame = { height: '0px', opacity: 0, overflow: 'hidden' };

    const animation = element.animate(expanding ? [collapsedFrame, expandedFrame] : [expandedFrame, collapsedFrame], {
      duration,
      easing: 'ease-in-out',
      fill: expanding ? 'none' : 'forwards'
    });

    const complete = () => this.finishExpansion(event);
    animation.finished.then(complete, complete);
  }

  /**
   * Wird am Ende der Ein- bzw. Ausklapp-Animation aufgerufen und gibt ein Event über luxAfterExpansion ab.
   */
  expansionDone() {
    this.luxAfterExpansion.emit();
  }

  /**
   * Schließt die Animation ab. Das erste Rendern einer initial aufgeklappten Karte zählt nicht als Aufklappen,
   * und nach dem Zerstören der Karte darf das Output nicht mehr emittieren.
   */
  private finishExpansion(event: AnimationCallbackEvent) {
    event.animationComplete();

    if (this.initialRenderDone && !this.destroyRef.destroyed) {
      this.expansionDone();
    }
  }

  private prefersReducedMotion(): boolean {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
