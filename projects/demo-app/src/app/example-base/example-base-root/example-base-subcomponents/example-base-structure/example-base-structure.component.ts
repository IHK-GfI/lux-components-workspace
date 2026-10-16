import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, contentChild, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { ExampleBaseContentComponent } from '../example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../example-base-options/example-base-simple-options.component';

@Component({
  selector: 'example-base-structure',
  templateUrl: './example-base-structure.component.html',
  styleUrls: ['./example-base-structure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly exampleTitle = input('ToDo');
  readonly exampleIconName = input('');
  readonly exampleDocumentationHref = input('');

  readonly contentComponent = contentChild(ExampleBaseContentComponent);
  readonly simpleOptionsComponent = contentChild(ExampleBaseSimpleOptionsComponent);
  readonly advancedOptionsComponent = contentChild(ExampleBaseAdvancedOptionsComponent);

  readonly isGtSm = signal(false);

  private router = inject(Router);
  private footerService = inject(LuxAppFooterButtonService);
  private configService = inject(LuxComponentsConfigService);
  private mediaQueryService = inject(LuxMediaQueryObserverService);

  private initialConfig: LuxComponentsConfigParameters;

  constructor() {
    this.initialConfig = this.configService.currentConfig;

    this.configService.config.pipe(takeUntilDestroyed()).subscribe((config: LuxComponentsConfigParameters) => {
      if (this.initialConfig !== config) {
        this.initialConfig = config;
      }
    });

    this.isGtSm.set(!this.mediaQueryService.isXS() && !this.mediaQueryService.isSM());

    this.mediaQueryService
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.isGtSm.set(!this.mediaQueryService.isXS() && !this.mediaQueryService.isSM()));
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
          window.open(this.exampleDocumentationHref(), '_blank');
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
  }

  onTabChanged(): void {
    this.simpleOptionsComponent()?.markForCheck();
    this.advancedOptionsComponent()?.markForCheck();
  }
}
