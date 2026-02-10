import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  inject
} from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigParameters } from '../../lux-components-config/lux-components-config-parameters.interface';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxUtil } from '../../lux-util/lux-util';
import { expansionAnim } from './lux-card-model/lux-card-animations';
import { LuxCardActionsComponent } from './lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentExpandedComponent } from './lux-card-subcomponents/lux-card-content-expanded.component';
import { LuxCardContentComponent } from './lux-card-subcomponents/lux-card-content.component';
import { LuxCardCustomHeaderComponent } from './lux-card-subcomponents/lux-card-custom-header.component';
import { LuxCardHeadingComponent } from './lux-card-subcomponents/lux-card-heading.component';
import { LuxCardInfoComponent } from './lux-card-subcomponents/lux-card-info.component';

@Component({
  selector: 'lux-card',
  templateUrl: './lux-card.component.html',
  animations: [expansionAnim],
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
  host: {
    class: 'lux-flex'
  }
})
export class LuxCardComponent implements OnInit, AfterViewInit, OnDestroy {
  private componentsConfigService = inject(LuxComponentsConfigService);
  private cdr = inject(ChangeDetectorRef);

  private configSubscription?: Subscription;

  @Input() luxTitle?: string;
  @Input() luxTitleTooltip?: string;
  @Input() luxSubTitle?: string;
  @Input() luxSubTitleTooltip?: string;
  @Input() luxIconName?: string;
  @Input() luxDisabled?: boolean;
  @Input() luxTagId?: string;
  @Input() luxTitleLineBreak = true;
  @Input() luxExpanded = false;
  @Input() luxUseTabIndex = true;
  @Input() luxHeading = 2;
  @Input() luxExpandedLabelOpen = '';
  @Input() luxExpandedLabelClose = '';

  @Output() luxExpandedChange = new EventEmitter<boolean>();
  @Output() luxAfterExpansion = new EventEmitter<void>();
  @Output() luxClicked = new EventEmitter<Event>();

  @ContentChildren(LuxIconComponent, { descendants: false }) iconComponents!: QueryList<LuxIconComponent>;
  @ContentChild(LuxCardActionsComponent) actionsComponent?: LuxCardActionsComponent;
  @ContentChild(LuxCardInfoComponent) infoComponent?: LuxCardInfoComponent;
  @ContentChild(LuxCardContentExpandedComponent) contentExpandedComponent?: LuxCardContentExpandedComponent;
  @ContentChild(LuxCardContentComponent) contentComponent?: LuxCardContentComponent;
  @ContentChild(LuxCardCustomHeaderComponent) customHeaderComponent?: LuxCardCustomHeaderComponent;

  hasCardAction?: boolean;
  animationDisabled = true;

  ngOnInit() {
    if (!this.luxTagId) {
      this.luxTagId = this.luxTitle;
    }

    if (this.luxClicked.observed) {
      this.hasCardAction = true;
    }
  }

  ngAfterViewInit() {
    // Über die Konfiguration abfragen, ob die Animationen für Cards deaktiviert sind.
    this.configSubscription = this.componentsConfigService.config.subscribe((config: LuxComponentsConfigParameters) => {
      this.animationDisabled = !config.cardExpansionAnimationActive;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.configSubscription?.unsubscribe();
  }

  get showButtons() {
    return !!this.actionsComponent;
  }

  get showIcon() {
    return this.iconComponents && this.iconComponents.length === 1;
  }

  get showExpandedToggle() {
    return !!this.contentExpandedComponent;
  }

  /**
   * Header wird nur angezeigt, wenn wenigstens eines der Header-Elemente vorhanden ist
   * (Icon, Title, Subtitle, Info-Komponente).
   */
  get showHeader() {
    return (
      this.showIcon ||
      !!(this.luxTitle && this.luxTitle.length > 0) ||
      !!(this.luxSubTitle && this.luxSubTitle.length > 0) ||
      !!this.infoComponent
    );
  }

  changeContentExpansion(event: any) {
    LuxUtil.stopEventPropagation(event);

    this.luxExpanded = !this.luxExpanded;
    this.luxExpandedChange.emit(this.luxExpanded);
  }

  clicked(event: Event) {
    if (!this.luxDisabled && !this.showButtons) {
      this.luxClicked.emit(event);
    }
  }

  /**
   * setzt das korrekte Alignment der Titelzeile. Ist der Titel im Zweifel mehrzeilig, so wird das Icon
   * im Titel nach oben ausgerichtet, damit es nicht mittig neben dem Titel schwebt. Ist der Titel aber
   * einzeilig, so wird das Icon vertikal zum Titel ausgerichtet.
   */
  getTitleAlignment(): string {
    if (this.luxTitleLineBreak && this.showIcon) {
      return 'left top';
    }

    return 'left center';
  }

  /**
   * Gibt den Status der Animation zurück.
   */
  getAnimState(): string {
    return this.luxExpanded ? 'expand' : 'void';
  }

  /**
   * Gibt die Dauer der Animation abhängig davon, ob sie via Config deaktiviert wurden oder nicht zurück.
   */
  getAnimDuration() {
    return this.animationDisabled ? 0 : 300;
  }

  /**
   * Wird am Ende der Ausklapp-Animation aufgerufen und setzt das animationActive-Flag auf false und gibt ein Event
   * über den luxAfterExpansion-EventEmitter ab.
   */
  expansionDone() {
    this.luxAfterExpansion.emit();
  }
}
