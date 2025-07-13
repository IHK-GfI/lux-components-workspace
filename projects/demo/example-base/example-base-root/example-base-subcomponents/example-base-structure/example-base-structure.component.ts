import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    LuxAppFooterButtonInfo,
    LuxAppFooterButtonService,
    LuxCardActionsComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxComponentsConfigParameters,
    LuxComponentsConfigService,
    LuxMediaQueryObserverService,
    LuxTabComponent,
    LuxTabsComponent
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../example-base-options/example-base-simple-options.component';

@Component({
  selector: 'example-base-structure',
  templateUrl: './example-base-structure.component.html',
  styleUrls: ['./example-base-structure.component.scss'],
  imports: [
    LuxCardActionsComponent,
    LuxCardContentComponent,
    LuxCardComponent,
    LuxTabsComponent,
    LuxTabComponent,
    NgClass,
    NgTemplateOutlet
  ]
})
export class ExampleBaseStructureComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private footerService = inject(LuxAppFooterButtonService);
  private configService = inject(LuxComponentsConfigService);
  private mediaQueryService = inject(LuxMediaQueryObserverService);

  private initialConfig: LuxComponentsConfigParameters;

  @Input() exampleTitle = 'ToDo';
  @Input() exampleIconName = '';
  @Input() exampleDocumentationHref = '';

  @ContentChild(ExampleBaseContentComponent) contentComponent?: ExampleBaseContentComponent;
  @ContentChild(ExampleBaseSimpleOptionsComponent) simpleOptionsComponent?: ExampleBaseSimpleOptionsComponent;
  @ContentChild(ExampleBaseAdvancedOptionsComponent) advancedOptionsComponent?: ExampleBaseAdvancedOptionsComponent;

  subscription: Subscription;

  isGtSm: boolean;

  constructor() {
    this.initialConfig = this.configService.currentConfig;

    this.subscription = this.configService.config.subscribe((config: LuxComponentsConfigParameters) => {
      if (this.initialConfig !== config) {
        this.initialConfig = config;
      }
    });

    this.isGtSm = !this.mediaQueryService.isXS() && !this.mediaQueryService.isSM();

    this.subscription = this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe(() => {
      this.isGtSm = !this.mediaQueryService.isXS() && !this.mediaQueryService.isSM();
    });
  }

  ngOnInit() {
    this.footerService.pushButtonInfos(
      LuxAppFooterButtonInfo.generateInfo({
        label: 'Dokumentation',
        iconName: 'lux-interface-arrows-expand-5',
        cmd: 'documentation-btn',
        color: 'primary',
        flat: true,
        raised: false,
        alwaysVisible: false,
        onClick: () => {
          window.open(this.exampleDocumentationHref, '_blank');
        }
      }),
      LuxAppFooterButtonInfo.generateInfo({
        label: 'Overview',
        iconName: 'lux-interface-arrows-button-left',
        cmd: 'back-btn',
        color: 'primary',
        flat: true,
        raised: false,
        alwaysVisible: true,
        onClick: () => {
          this.router.navigate(['components-overview']);
        }
      })
    );
  }

  ngOnDestroy() {
    this.footerService.clearButtonInfos();
    // Falls das Beispiel mit der Konfiguration herum spielt, sollte diese beim Verlassen wieder resettet werden.
    this.configService.updateConfiguration(this.initialConfig);

    this.subscription.unsubscribe();
  }
}
