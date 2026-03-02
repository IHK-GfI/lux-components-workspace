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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';

@Injectable({
  providedIn: 'root'
})
export class LuxTableLocalColumnVisibilityStore implements ILuxTableColumnVisibilityStore {
  private configService = inject(LuxComponentsConfigService);
  private useLocalStorageForComponentsAllowed = this.configService.currentConfig.useLocalStorageForComponentsAllowed;

  constructor() {
    this.configService.config.pipe(takeUntilDestroyed()).subscribe((cfg) => {
      this.useLocalStorageForComponentsAllowed = cfg.useLocalStorageForComponentsAllowed;
    });
  }

  load(key: string): string[] {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return [];
      }
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter((v) => typeof v === 'string') : [];
    } catch {
      return [];
    }
  }

  save(key: string, hidden: string[]): void {
    try {
      if (this.useLocalStorageForComponentsAllowed) {
        localStorage.setItem(key, JSON.stringify(hidden || []));
      }
    } catch {
      /* ignore quota errors */
    }
  }
}
