/**
 * Interface für die Speicherung der Sichtbarkeit von Tabellenspalten.
 *
 * Der Key ist dabei ein eindeutiger Bezeichner für die Tabelle (z.B. "userTable").
 * Der Wert ist ein Array von Spalten-Definitionsnamen (columnDef), die ausgeblendet sind.
 */
export interface ILuxTableColumnVisibilityStore {
  load(key: string): string[];
  save(key: string, hidden: string[]): void;
}

/**
 * Einfache LocalStorage-Implementierung für versteckte Tabellenspalten.
 * Verwendet JSON-Array (z.B. ["columnDef1", "columnDef2"]).
 */
import { Injectable, inject } from '@angular/core';
import { LuxConsentPurpose } from '../../lux-consent/lux-consent.model';
import { LuxConsentService } from '../../lux-consent/lux-consent.service';
import { LuxStorageService } from '../../lux-util/lux-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LuxTableLocalColumnVisibilityStore implements ILuxTableColumnVisibilityStore {
  private consentService = inject(LuxConsentService);
  private storageService = inject(LuxStorageService);

  load(key: string): string[] {
    try {
      if (this.consentService.hasConsent(LuxConsentPurpose.Preferences)) {
        const raw = this.storageService.getItem(key);
        if (!raw) {
          return [];
        }
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.filter((v) => typeof v === 'string') : [];
      } else {
        this.storageService.removeItem(key);
        return [];
      }
    } catch {
      return [];
    }
  }

  save(key: string, hidden: string[]): void {
    try {
      if (this.consentService.hasConsent(LuxConsentPurpose.Preferences)) {
        this.storageService.setItem(key, JSON.stringify(hidden || []), false);
      } else {
        this.storageService.removeItem(key);
      }
    } catch {
      /* ignore quota errors */
    }
  }
}
