import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { map } from 'rxjs';
import { LuxButtonComponent } from '../lux-action/lux-button/lux-button.component';
import { LuxLinkPlainComponent } from '../lux-action/lux-link-plain/lux-link-plain.component';
import { LuxTableColumnContentComponent } from '../lux-common/lux-table/lux-table-subcomponents/lux-table-column-content.component';
import { LuxTableColumnHeaderComponent } from '../lux-common/lux-table/lux-table-subcomponents/lux-table-column-header.component';
import { LuxTableColumnComponent } from '../lux-common/lux-table/lux-table-subcomponents/lux-table-column.component';
import { LuxTableComponent } from '../lux-common/lux-table/lux-table.component';
import { LuxToggleAcComponent } from '../lux-form/lux-toggle-ac/lux-toggle-ac.component';
import { LuxDividerComponent } from '../lux-layout/lux-divider/lux-divider.component';
import { LuxDialogRef } from '../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from '../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from '../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxMediaQueryObserverService } from '../lux-util/lux-media-query-observer.service';
import LUX_CONSENT_CATEGORIES from './lux-consent-categories';
import { ILuxConsentConfig } from './lux-consent-config.interface';
import LUX_CONSENT_ENTRIES from './lux-consent-entries';
import { LuxConsentEntry, LuxConsentPurpose, LuxConsentStorageType, LuxCookieCategory } from './lux-consent.model';
import { LuxConsentService } from './lux-consent.service';

type LuxConsentSection = 'consent' | 'datenschutz' | 'impressum';

@Component({
  selector: 'lux-consent-dialog',
  templateUrl: './lux-consent-dialog.component.html',
  styleUrls: ['./lux-consent-dialog.component.scss'],
  host: {
    '[class.mobile-view]': 'mobileView()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxButtonComponent,
    LuxLinkPlainComponent,
    LuxToggleAcComponent,
    LuxTableComponent,
    LuxTableColumnComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnContentComponent,
    NgComponentOutlet,
    LuxDividerComponent,
    TranslocoPipe
  ]
})
export class LuxConsentDialogComponent {
  private readonly dialogRef = inject(LuxDialogRef);
  private readonly consentService = inject(LuxConsentService);
  private readonly mediaQueryService = inject(LuxMediaQueryObserverService);

  protected readonly consentConfig: ILuxConsentConfig = this.consentService.getCurrentConfig();

  // merge default entries with any entries provided via DI config
  protected readonly combinedEntries: LuxConsentEntry[] = [...LUX_CONSENT_ENTRIES, ...(this.consentConfig?.entries ?? [])];
  protected readonly hasNonEssentialEntries = this.combinedEntries.some((entry) => entry.purpose !== LuxConsentPurpose.Essential);

  protected readonly LuxConsentPurpose = LuxConsentPurpose;
  protected readonly storageTypes: LuxConsentStorageType[] = Object.values(LuxConsentStorageType) as LuxConsentStorageType[];

  private readonly tableDataByPurposeAndType: Record<string, LuxConsentEntry[]> = this.buildTableDataByPurposeAndType();

  protected readonly cookieCategories = signal<LuxCookieCategory[]>(LUX_CONSENT_CATEGORIES.map((category) => ({ ...category })));

  protected readonly mobileView = toSignal(
    this.mediaQueryService.getMediaQueryChangedAsObservable().pipe(map(() => this.mediaQueryService.isSmallerOrEqual('sm'))),
    { initialValue: this.mediaQueryService.isSmallerOrEqual('sm') }
  );

  private readonly consentState = toSignal(this.consentService.getConsentState(), { initialValue: null });

  protected readonly isExpanded = signal(false);
  protected readonly activeSection = signal<LuxConsentSection>('consent');
  protected readonly impressumComponentResolved = signal<Type<unknown> | null>(this.consentConfig.impressumComponent ?? null);
  protected readonly datenschutzComponentResolved = signal<Type<unknown> | null>(this.consentConfig.datenschutzComponent ?? null);

  constructor() {
    effect(() => {
      const state = this.consentState();
      if (state) {
        this.cookieCategories.update((categories) =>
          categories.map((category) => (category.disabled ? category : { ...category, enabled: state.purposes.includes(category.purpose) }))
        );
      }
    });
  }

  protected getEntriesForPurposeAndType(purpose: LuxConsentPurpose, type: LuxConsentStorageType): LuxConsentEntry[] {
    return this.tableDataByPurposeAndType[`${purpose}_${type}`] || [];
  }

  protected hasConfiguredEntriesForCategory(purpose: LuxConsentPurpose): boolean {
    return this.storageTypes.some((type) => this.getEntriesForPurposeAndType(purpose, type).length > 0);
  }

  protected toggleDetails(): void {
    this.isExpanded.update((expanded) => !expanded);
  }

  protected acceptAll(): void {
    this.consentService.acceptAll();
    this.dialogRef.closeDialog();
  }

  protected declineAll(): void {
    this.consentService.declineNonFunctional();
    this.dialogRef.closeDialog();
  }

  protected acceptSelected(): void {
    const selectedPurposes = this.cookieCategories()
      .filter((category) => category.enabled)
      .map((category) => category.purpose);

    this.consentService.saveCustomConsent(selectedPurposes);
    this.dialogRef.closeDialog();
  }

  protected closeDialog(): void {
    this.consentService.onCloseDialog();
    this.dialogRef.closeDialog();
  }

  protected toggleCategoryEnabled(purpose: LuxConsentPurpose, isEnabled: boolean): void {
    this.cookieCategories.update((categories) =>
      categories.map((category) => (category.purpose === purpose && !category.disabled ? { ...category, enabled: isEnabled } : category))
    );
  }

  protected async showSection(section: LuxConsentSection): Promise<void> {
    if (section === 'consent') {
      this.activeSection.set('consent');
      return;
    }

    if (section === 'impressum') {
      if (this.impressumComponentResolved()) {
        this.activeSection.set('impressum');
        return;
      }
      if (this.consentConfig.impressumComponentLoader) {
        try {
          this.impressumComponentResolved.set(await this.consentConfig.impressumComponentLoader());
          this.activeSection.set('impressum');
        } catch (error) {
          console.error('Konnte Impressum-Komponente nicht laden.', error);
          if (this.consentConfig.impressumUrl) {
            window.open(this.consentConfig.impressumUrl, '_blank', 'noopener,noreferrer');
          } else {
            this.activeSection.set('consent');
          }
        }
        return;
      }
      if (this.consentConfig.impressumUrl) {
        window.open(this.consentConfig.impressumUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (this.datenschutzComponentResolved()) {
      this.activeSection.set('datenschutz');
      return;
    }
    if (this.consentConfig.datenschutzComponentLoader) {
      try {
        this.datenschutzComponentResolved.set(await this.consentConfig.datenschutzComponentLoader());
        this.activeSection.set('datenschutz');
      } catch (error) {
        console.error('Konnte Datenschutz-Komponente nicht laden.', error);
        if (this.consentConfig.datenschutzUrl) {
          window.open(this.consentConfig.datenschutzUrl, '_blank', 'noopener,noreferrer');
        } else {
          this.activeSection.set('consent');
        }
      }
      return;
    }
    if (this.consentConfig.datenschutzUrl) {
      window.open(this.consentConfig.datenschutzUrl, '_blank', 'noopener,noreferrer');
    }
  }

  private buildTableDataByPurposeAndType(): Record<string, LuxConsentEntry[]> {
    const tableData: Record<string, LuxConsentEntry[]> = {};
    for (const category of LUX_CONSENT_CATEGORIES) {
      for (const type of this.storageTypes) {
        const key = `${category.purpose}_${type}`;
        tableData[key] = this.combinedEntries.filter((cookie) => cookie.purpose === category.purpose && cookie.type === type);
      }
    }
    return tableData;
  }
}
