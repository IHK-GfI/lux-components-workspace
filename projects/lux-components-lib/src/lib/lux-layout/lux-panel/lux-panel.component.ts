import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxAccordionComponent, LuxTogglePosition } from '../lux-accordion/lux-accordion.component';

@Component({
  selector: 'lux-panel',
  templateUrl: './lux-panel.component.html',
  styleUrls: ['./lux-panel.component.scss'],
  imports: [MatExpansionPanel, MatExpansionPanelHeader]
})
export class LuxPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  protected parent = inject(LuxAccordionComponent, { optional: true, host: true, skipSelf: true });
  protected mediaQuery = inject(LuxMediaQueryObserverService);

  _luxDynamicHeaderHeight?: boolean;

  headerHeightCacheActive = false;
  expandedHeaderHeightCache?: string;
  collapsedHeaderHeightCache?: string;

  @Input() luxDisabled?: boolean;
  @Input() luxExpanded = false;
  @Input() luxHideToggle?: boolean;
  @Input() luxTogglePosition?: LuxTogglePosition;

  @Input() luxCollapsedHeaderHeight?: string;
  @Input() luxExpandedHeaderHeight?: string;
  @Input() set luxDynamicHeaderHeight(value: boolean | undefined) {
    this._luxDynamicHeaderHeight = value;

    if (value) {
      this.headerHeightCacheActive = true;
      this.expandedHeaderHeightCache = this.luxExpandedHeaderHeight;
      this.collapsedHeaderHeightCache = this.luxCollapsedHeaderHeight;

      this.luxExpandedHeaderHeight = 'unset';
      this.luxCollapsedHeaderHeight = 'unset';
    } else {
      if (this.headerHeightCacheActive) {
        this.luxExpandedHeaderHeight = this.expandedHeaderHeightCache;
        this.luxCollapsedHeaderHeight = this.collapsedHeaderHeightCache;
      }
    }
  }

  get luxDynamicHeaderHeight() {
    return this._luxDynamicHeaderHeight;
  }

  @Output() luxOpened = new EventEmitter<void>();
  @Output() luxClosed = new EventEmitter<void>();
  @Output() luxExpandedChange = new EventEmitter<boolean>();

  @ViewChild(MatExpansionPanel, { static: true }) matExpansionPanel!: MatExpansionPanel;

  subscriptions: Subscription[] = [];
  mobile: boolean;

  constructor() {
    this.mobile = this.mediaQuery.isSmallerOrEqual('sm');

    this.subscriptions.push(
      this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
        this.mobile = this.mediaQuery.isSmallerOrEqual('sm');
      })
    );
  }

  ngOnInit() {
    if (this.parent) {
      if (this.luxHideToggle === undefined) {
        this.luxHideToggle = this.parent.luxHideToggle;
      }
      if (this.luxDisabled === undefined) {
        this.luxDisabled = this.parent.luxDisabled;
      }
      if (this.luxExpandedHeaderHeight === undefined) {
        this.luxExpandedHeaderHeight = this.parent.luxExpandedHeaderHeight;
      }
      if (this.luxCollapsedHeaderHeight === undefined) {
        this.luxCollapsedHeaderHeight = this.parent.luxCollapsedHeaderHeight;
      }
      if (this.luxDynamicHeaderHeight === undefined) {
        this.luxDynamicHeaderHeight = this.parent.luxDynamicHeaderHeight;
      }
      if (this.luxTogglePosition === undefined) {
        if (this.parent.luxTogglePosition === undefined) {
          this.luxTogglePosition = 'after';
        } else {
          this.luxTogglePosition = this.parent.luxTogglePosition;
        }
      }

      // Um eine zyklische Abhängigkeit mit dem lux-accordion zu vermeiden,
      // wurde hier ein Event verwendet.
      this.subscriptions.push(
        this.parent.changed$.subscribe((propertyName) => {
          if (this.parent) {
            if (propertyName === 'luxHideToggle') {
              this.luxHideToggle = this.parent.luxHideToggle;
            } else if (propertyName === 'luxDisabled') {
              this.luxDisabled = this.parent.luxDisabled;
            } else if (propertyName === 'luxDynamicHeaderHeight') {
              this.luxDynamicHeaderHeight = this.parent.luxDynamicHeaderHeight;
            } else if (propertyName === 'luxExpandedHeaderHeight') {
              this.luxExpandedHeaderHeight = this.parent.luxExpandedHeaderHeight;
            } else if (propertyName === 'luxCollapsedHeaderHeight') {
              this.luxCollapsedHeaderHeight = this.parent.luxCollapsedHeaderHeight;
            } else if (propertyName === 'luxTogglePosition') {
              this.luxTogglePosition = this.parent.luxTogglePosition;
            }
          }
        })
      );
    }
  }

  ngAfterViewInit() {
    LuxUtil.assertNonNull('matExpansionPanel', this.getMatExpansionPanel());

    // Diese Zeile wird benötigt, damit der Multi-Mode (nur ein Abschnitt darf geöffnet sein)
    // des Accordions funktioniert. Die Zuweisung des übergeordneten Accordions an dieses Panel
    // muss einen Zyklus später stattfinden, um einen ExpressionChangedAfterItHasBeenCheckedError
    // zu vermeiden.
    setTimeout(() => {
      if (this.parent) {
        this.getMatExpansionPanel().accordion = this.parent.matAccordion;
      }
    });
  }

  protected getMatExpansionPanel() {
    return this.matExpansionPanel;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }

  onOpened() {
    this.luxOpened.emit();
    this.luxExpanded = true;
    this.luxExpandedChange.emit(this.luxExpanded);
  }

  onClosed() {
    this.luxClosed.emit();
    this.luxExpanded = false;
    this.luxExpandedChange.emit(this.luxExpanded);
  }
}
