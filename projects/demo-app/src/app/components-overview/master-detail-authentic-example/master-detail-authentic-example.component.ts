import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  LuxAppFooterButtonInfo,
  LuxAppFooterButtonService,
  LuxBadgeComponent,
  LuxButtonComponent,
  LuxConsoleService,
  LuxDetailHeaderComponent,
  LuxDetailViewComponent,
  LuxFilterFormComponent,
  LuxFilterFormExtendedComponent,
  LuxIconComponent,
  LuxInputComponent,
  LuxLabelComponent,
  LuxMasterDetailComponent,
  LuxMasterFooterComponent,
  LuxMasterHeaderContentComponent,
  LuxMasterListComponent,
  LuxMenuComponent,
  LuxMenuItemComponent,
  LuxRelativeTimestampPipe,
  LuxSelectComponent,
  LuxTabComponent,
  LuxTabsComponent,
  LuxThemeService,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { of } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { DetailExampleComponent } from './detail-example/detail-example.component';
import { MasterDetailExampleDataService } from './master-detail-example-data.service';
import { TextExampleComponent } from './text-example/text-example.component';

@Component({
  selector: 'lux-master-detail-authentic-example',
  templateUrl: './master-detail-authentic-example.component.html',
  styleUrls: ['./master-detail-authentic-example.component.scss'],
  providers: [MasterDetailExampleDataService],
  imports: [
    LuxRelativeTimestampPipe,
    LuxIconComponent,
    LuxFilterFormExtendedComponent,
    LuxFilterFormComponent,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxButtonComponent,
    LuxDetailHeaderComponent,
    LuxMasterListComponent,
    LuxMasterDetailComponent,
    LuxMasterHeaderContentComponent,
    LuxMasterFooterComponent,
    LuxDetailViewComponent,
    LuxTabsComponent,
    LuxTabComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    DetailExampleComponent,
    TextExampleComponent,
    LuxBadgeComponent,
    LuxLabelComponent,
    NgTemplateOutlet,
    LuxInputComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.authentic]': 'theme() === "authentic"',
    '[class.green]': 'theme() === "green"'
  }
})
export class MasterDetailAuthenticExampleComponent implements OnInit, OnDestroy {
  options = [
    { value: null, label: 'Kein Filter' },
    { value: Date.now() + MasterDetailExampleDataService.DAY * 3, label: 'Nächste 3 Tage' },
    { value: Date.now() + MasterDetailExampleDataService.DAY * 7, label: 'Nächste 7 Tage' },
    { value: Date.now() + MasterDetailExampleDataService.DAY * 14, label: 'Nächste 14 Tage' },
    { value: Date.now() + MasterDetailExampleDataService.MONTH, label: 'Nächsten Monat' }
  ];

  configuration: {
    emptyIconDetail: string;
    emptyIconMaster: string;
    emptyIconDetailSize: string;
    emptyIconMasterSize: string;
    emptyLabelDetail: string;
    emptyLabelMaster: string;
    opened: boolean;
    lineBreak: boolean;
    ignoreScrollLoading: boolean;
    alignEmptyElements: boolean;
    showCustomCardHeader: boolean;
  } = {
    emptyIconDetail: 'lux-interface-delete-1',
    emptyIconMaster: 'lux-interface-delete-1',
    emptyIconDetailSize: '5x',
    emptyIconMasterSize: '5x',
    emptyLabelDetail: 'Keine Daten!',
    emptyLabelMaster: 'Keine Daten!',
    opened: true,
    lineBreak: false,
    ignoreScrollLoading: false,
    alignEmptyElements: true,
    showCustomCardHeader: true
  };

  // toggleMasterFocus des infinite scroll
  scrollSteps = 5;
  // Enthält alle list-item Einträge immer vor
  allMasterEntries: any[];
  readonly masterEntries = signal<any[]>([]);
  readonly masterIsReloading = signal(false);
  readonly selectedDetail = signal<any>(undefined);
  readonly showCustomDetailHeader = signal(false);
  readonly theme: WritableSignal<string>;

  private readonly dataService = inject(MasterDetailExampleDataService);
  private readonly router = inject(Router);
  private readonly footerService = inject(LuxAppFooterButtonService);
  private readonly logger = inject(LuxConsoleService);
  private readonly themeService = inject(LuxThemeService);

  constructor() {
    this.allMasterEntries = this.dataService.createExampleData(20);
    const temp = this.allMasterEntries.slice(0, 10);

    this.masterEntries.update((entries) => entries.concat(temp));

    this.theme = signal(this.themeService.getTheme().name);
    this.themeService
      .getThemeAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((theme) => {
        this.theme.set(theme.name);
      });
  }

  ngOnInit(): void {
    this.footerService.pushButtonInfos(
      LuxAppFooterButtonInfo.generateInfo({
        label: 'Dokumentation',
        iconName: 'lux-interface-arrows-expand-5',
        cmd: 'documentation-btn',
        color: 'primary',
        raised: true,
        alwaysVisible: false,
        onClick: () => {
          window.open(
            'https://github.com/IHK-GfI/lux-components-workspace/wiki/lux%E2%80%90master%E2%80%90detail%E2%80%90ac-v21',
            '_blank'
          );
        }
      }),
      LuxAppFooterButtonInfo.generateInfo({
        label: 'Overview',
        iconName: 'lux-interface-arrows-button-left',
        cmd: 'back-btn',
        color: 'primary',
        raised: true,
        alwaysVisible: true,
        onClick: () => {
          this.router.navigate(['components-overview']);
        }
      })
    );

    of(this.masterEntries()[1])
      .pipe(take(1), delay(2000))
      .subscribe((v) => {
        this.selectedDetail.set(v);
      });
  }

  ngOnDestroy(): void {
    this.footerService.clearButtonInfos();
  }

  /**
   * Funktion zum Nachladen von Master-Einträgen (von Infinite-Scrolling)
   */
  onLoadListTest() {
    if (
      this.configuration.ignoreScrollLoading ||
      this.masterIsReloading() ||
      this.masterEntries().length === this.allMasterEntries.length
    ) {
      return;
    }

    of(null)
      .pipe(
        take(1),
        delay(0),
        tap(() => {
          this.masterIsReloading.set(true);
        }),
        delay(1500)
      )
      .subscribe(() => {
        const start = this.masterEntries().length;
        let end = start + this.scrollSteps;
        if (end > this.allMasterEntries.length) {
          end = this.allMasterEntries.length;
        }

        const temp = this.allMasterEntries.slice(start, end);
        if (temp && temp.length > 0) {
          this.masterEntries.update((entries) => entries.concat(temp));
        }
        this.masterIsReloading.set(false);
      });
  }

  loadDetail(data: any) {
    this.logger.log('Detail geladen', data);
  }

  changeFilter(event: any) {
    if (!event.value) {
      this.masterEntries.set(this.allMasterEntries);
      this.configuration.ignoreScrollLoading = false;
    } else {
      this.masterEntries.set(this.allMasterEntries.filter((entry) => entry.timestamp < event.value));
      this.configuration.ignoreScrollLoading = true;
    }
  }

  /**
   * Master-Detail nutzt die Funktion, um Objekte in der MasterListe miteinander zu vergleichen.
   * @param o1
   * @param o2
   */
  compareFn(o1: any, o2: any) {
    return o1.id === o2.id;
  }

  clearList() {
    this.masterEntries.set([]);
    this.selectedDetail.set(-1);
  }

  fillList() {
    this.masterEntries.set(this.allMasterEntries);
  }

  reverseList() {
    this.masterEntries.update((entries) => entries.slice().reverse());
  }

  fillListFirstTenItems() {
    this.masterEntries.set(this.allMasterEntries.slice(0, 10));
  }

  fillListLastTenItems() {
    this.masterEntries.set(this.allMasterEntries.slice(this.allMasterEntries.length - 10, this.allMasterEntries.length));
  }
}
