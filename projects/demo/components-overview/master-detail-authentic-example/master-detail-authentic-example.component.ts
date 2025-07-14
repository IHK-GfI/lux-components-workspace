import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    LuxAppFooterButtonInfo,
    LuxAppFooterButtonService,
    LuxButtonComponent,
    LuxConsoleService,
    LuxDetailHeaderAcComponent,
    LuxDetailViewAcComponent,
    LuxFilterFormComponent,
    LuxFilterFormExtendedComponent,
    LuxIconComponent,
    LuxMasterDetailAcComponent,
    LuxMasterFooterAcComponent,
    LuxMasterHeaderContentAcComponent,
    LuxMasterListAcComponent,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxRelativeTimestampPipe,
    LuxSelectAcComponent,
    LuxTabComponent,
    LuxTabsComponent,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { of } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { DetailExampleComponent } from './detail-example/detail-example.component';
import { MasterDetailExampleDataService } from './master-detail-example-data.service';
import { TextExampleComponent } from './text-example/text-example.component';
import { DetailTableExampleComponent } from './detail-table-example/detail-table-example.component';

@Component({
  selector: 'lux-master-detail-ac-example',
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
    LuxDetailHeaderAcComponent,
    LuxMasterListAcComponent,
    LuxMasterDetailAcComponent,
    LuxMasterHeaderContentAcComponent,
    LuxMasterFooterAcComponent,
    LuxDetailViewAcComponent,
    LuxTabsComponent,
    LuxTabComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    DetailExampleComponent,
    TextExampleComponent,
    DetailTableExampleComponent
  ]
})
export class MasterDetailAuthenticExampleComponent implements OnInit, OnDestroy {
  private dataService = inject(MasterDetailExampleDataService);
  private router = inject(Router);
  private footerService = inject(LuxAppFooterButtonService);
  private logger = inject(LuxConsoleService);

  options = [
    { value: null, label: 'Kein Filter' },
    { value: Date.now() + MasterDetailExampleDataService.DAY * 3, label: 'Nächste 3 Tage' },
    { value: Date.now() + MasterDetailExampleDataService.DAY * 7, label: 'Nächste 7 Tage' },
    { value: Date.now() + MasterDetailExampleDataService.DAY * 14, label: 'Nächste 14 Tage' },
    { value: Date.now() + MasterDetailExampleDataService.MONTH, label: 'Nächsten Monat' }
  ];

  masterHeaderOptions = [
    { value: 'card', label: 'Filter in einer Card' },
    { value: 'accordion', label: 'Filter in einem Accordion' },
    { value: 'empty', label: 'Leerer Master-Header' }
  ];
  masterHeaderOption = 'card';

  configuration: {
    emptyIconDetail: string;
    emptyIconMaster: string;
    emptyIconDetailSize: string;
    emptyIconMasterSize: string;
    emptyLabelDetail: string;
    emptyLabelMaster: string;
    opened: boolean;
    lineBreak: boolean;
    masterIsReloading: boolean;
    ignoreScrollLoading: boolean;
    alignEmptyElements: boolean;
  } = {
    emptyIconDetail: 'lux-interface-delete-1',
    emptyIconMaster: 'lux-interface-delete-1',
    emptyIconDetailSize: '5x',
    emptyIconMasterSize: '5x',
    emptyLabelDetail: 'Keine Daten!',
    emptyLabelMaster: 'Keine Daten!',
    opened: true,
    lineBreak: false,
    masterIsReloading: false,
    ignoreScrollLoading: false,
    alignEmptyElements: true
  };

  // toggleMasterFocus des infinite scroll
  scrollSteps = 5;
  // Enthält alle list-item Einträge immer vor
  allMasterEntries: any[];
  masterEntries: any[] = [];
  selectedDetail: any;
  showCustomDetailHeader = false;

  constructor() {
    this.allMasterEntries = this.dataService.createExampleData(20);
    const temp = this.allMasterEntries.slice(0, 10);

    this.masterEntries = this.masterEntries.concat(temp);
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
          window.open('https://github.com/IHK-GfI/lux-components/wiki/lux%E2%80%90master%E2%80%90detail', '_blank');
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

    of(this.masterEntries[1])
      .pipe(take(1), delay(2000))
      .subscribe((v) => (this.selectedDetail = v));
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
      this.configuration.masterIsReloading ||
      this.masterEntries.length === this.allMasterEntries.length
    ) {
      return;
    }

    of(null)
      .pipe(
        take(1),
        delay(0),
        tap(() => {
          this.configuration.masterIsReloading = true;
        }),
        delay(1500)
      )
      .subscribe(() => {
        const start = this.masterEntries.length;
        let end = start + this.scrollSteps;
        if (end > this.allMasterEntries.length) {
          end = this.allMasterEntries.length;
        }

        const temp = this.allMasterEntries.slice(start, end);
        if (temp && temp.length > 0) {
          this.masterEntries = this.masterEntries.concat(temp);
        }
        this.configuration.masterIsReloading = false;
      });
  }

  loadDetail(data: any) {
    this.logger.log('Detail geladen', data);
  }

  changeFilter(event: any) {
    if (!event.value) {
      this.masterEntries = this.allMasterEntries;
      this.configuration.ignoreScrollLoading = false;
    } else {
      this.masterEntries = this.allMasterEntries.filter((entry) => entry.timestamp < event.value);
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
    this.masterEntries = [];
    this.selectedDetail = -1;
  }

  fillList() {
    this.masterEntries = this.allMasterEntries;
  }

  reverseList() {
    this.masterEntries = this.masterEntries.reverse();
  }

  fillListFirstTenItems() {
    this.masterEntries = this.allMasterEntries.slice(0, 10);
  }

  fillListLastTenItems() {
    this.masterEntries = this.allMasterEntries.slice(this.allMasterEntries.length - 10, this.allMasterEntries.length);
  }
}
