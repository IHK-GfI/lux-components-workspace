import { NgComponentOutlet } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LuxButtonComponent } from '../lux-action/lux-button/lux-button.component';
import { LuxLinkPlainComponent } from '../lux-action/lux-link-plain/lux-link-plain.component';
import { LuxTableColumnContentComponent } from '../lux-common/lux-table/lux-table-subcomponents/lux-table-column-content.component';
import { LuxTableColumnHeaderComponent } from '../lux-common/lux-table/lux-table-subcomponents/lux-table-column-header.component';
import { LuxTableColumnComponent } from '../lux-common/lux-table/lux-table-subcomponents/lux-table-column.component';
import { LuxTableComponent } from '../lux-common/lux-table/lux-table.component';
import { LuxCheckboxAcComponent } from '../lux-form/lux-checkbox-ac/lux-checkbox-ac.component';
import { LuxToggleAcComponent } from '../lux-form/lux-toggle-ac/lux-toggle-ac.component';
import { LuxCheckboxContainerAcComponent } from '../lux-layout/lux-checkbox-container-ac/lux-checkbox-container-ac.component';
import { LuxDividerComponent } from '../lux-layout/lux-divider/lux-divider.component';
import { LuxDialogRef } from '../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from '../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from '../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import LUX_CONSENT_CATEGORIES from './lux-consent-categories';
import { ILuxConsentConfig } from './lux-consent-config.interface';
import LUX_CONSENT_ENTRIES from './lux-consent-entries';
import { LuxConsentEntry, LuxConsentPurpose, LuxConsentStorageType, LuxCookieCategory } from './lux-consent.model';
import { LuxConsentService } from './lux-consent.service';

@Component({
  selector: 'lux-consent-dialog',
  standalone: true,
  templateUrl: './lux-consent-dialog.component.html',
  styleUrls: ['./lux-consent-dialog.component.scss'],
  imports: [
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxButtonComponent,
    LuxLinkPlainComponent,
    LuxToggleAcComponent,
    LuxCheckboxAcComponent,
    LuxTableComponent,
    LuxTableColumnComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnContentComponent,
    LuxCheckboxContainerAcComponent,
    NgComponentOutlet,
    LuxDividerComponent
]
})
export class LuxConsentDialogComponent implements OnInit {
  isExpanded = false;
  activeSection: 'consent' | 'datenschutz' | 'impressum' = 'consent';
  impressumComponentResolved?: Type<unknown>;
  datenschutzComponentResolved?: Type<unknown>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(LuxDialogRef);
  private readonly consentService = inject(LuxConsentService);
  consentConfig!: ILuxConsentConfig;

  LuxConsentPurpose = LuxConsentPurpose;
  LuxConsentStorageType = LuxConsentStorageType;
  storageTypes: LuxConsentStorageType[] = Object.values(LuxConsentStorageType) as LuxConsentStorageType[];
  tableDataByPurposeAndType: Record<string, LuxConsentEntry[]> = {};
  combinedEntries: LuxConsentEntry[] = [];

  cookieCategories: LuxCookieCategory[] = LUX_CONSENT_CATEGORIES.map((category) => ({ ...category }));


  ngOnInit() {
    this.consentConfig = this.consentService.getCurrentConfig();

    this.impressumComponentResolved = this.consentConfig.impressumComponent;
    this.datenschutzComponentResolved = this.consentConfig.datenschutzComponent;

    this.consentService
      .getConsentState()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        if (state) {
          this.updateCategoriesFromState(state.purposes);
        }
      });

    // merge default entries with any entries provided via DI config
    this.combinedEntries = [...LUX_CONSENT_ENTRIES, ...(this.consentConfig?.entries ?? [])];

    this.precomputeTableData();
  }

  precomputeTableData() {
    this.tableDataByPurposeAndType = {};
    for (const category of this.cookieCategories) {
      for (const type of this.storageTypes) {
        const key = `${category.purpose}_${type}`;
        this.tableDataByPurposeAndType[key] = this.combinedEntries.filter(
          (cookie) => cookie.purpose === category.purpose && cookie.type === type
        );
      }
    }
  }

  getTableData(purpose: LuxConsentPurpose, type: LuxConsentStorageType): LuxConsentEntry[] {
    return this.tableDataByPurposeAndType[`${purpose}_${type}`] || [];
  }

  protected hasEntriesForCategory(purpose: LuxConsentPurpose): boolean {
    return this.storageTypes.some((type) => this.getTableData(purpose, type).length > 0);
  }

  toggleDetails() {
    this.isExpanded = !this.isExpanded;
  }

  acceptAll() {
    this.consentService.acceptAll();
    this.dialogRef.closeDialog();
  }

  declineAll() {
    this.consentService.declineNonFunctional();
    this.dialogRef.closeDialog();
  }

  acceptSelected() {
    const selectedPurposes = this.cookieCategories.filter((cat) => cat.enabled).map((cat) => cat.purpose);

    this.consentService.saveCustomConsent(selectedPurposes);
    this.dialogRef.closeDialog();
  }

  closeDialog() {
    this.consentService.onCloseDialog();
    this.dialogRef.closeDialog();
  }

  private updateCategoriesFromState(purposes: LuxConsentPurpose[]) {
    this.cookieCategories.forEach((category) => {
      if (!category.disabled) {
        category.enabled = purposes.includes(category.purpose);
      }
    });
  }

  protected getCategoryByPurpose(purpose: LuxConsentPurpose) {
    return this.cookieCategories.find((cat) => cat.purpose === purpose);
  }

  protected toggleCategoryEnabled(purpose: LuxConsentPurpose, $event: boolean) {
    const category = this.getCategoryByPurpose(purpose);
    if (category && !category.disabled) {
      category.enabled = $event;
    }
  }

  async showSection(section: 'consent' | 'impressum' | 'datenschutz') {
    if (section === 'consent') {
      this.activeSection = 'consent';
      return;
    }

    if (section === 'impressum') {
      if (this.impressumComponentResolved) {
        this.activeSection = 'impressum';
        return;
      }
      if (this.consentConfig.impressumComponentLoader) {
        try {
          this.impressumComponentResolved = await this.consentConfig.impressumComponentLoader();
          this.activeSection = 'impressum';
        } catch (error) {
          console.error('Konnte Impressum-Komponente nicht laden.', error);
          if (this.consentConfig.impressumUrl) {
            window.open(this.consentConfig.impressumUrl, '_blank', 'noopener,noreferrer');
          } else {
            this.activeSection = 'consent';
          }
        }
        return;
      }
      if (this.consentConfig.impressumUrl) {
        window.open(this.consentConfig.impressumUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (this.datenschutzComponentResolved) {
      this.activeSection = 'datenschutz';
      return;
    }
    if (this.consentConfig.datenschutzComponentLoader) {
      try {
        this.datenschutzComponentResolved = await this.consentConfig.datenschutzComponentLoader();
        this.activeSection = 'datenschutz';
      } catch (error) {
        console.error('Konnte Datenschutz-Komponente nicht laden.', error);
        if (this.consentConfig.datenschutzUrl) {
          window.open(this.consentConfig.datenschutzUrl, '_blank', 'noopener,noreferrer');
        } else {
          this.activeSection = 'consent';
        }
      }
      return;
    }
    if (this.consentConfig.datenschutzUrl) {
      window.open(this.consentConfig.datenschutzUrl, '_blank', 'noopener,noreferrer');
    }
  }
}
