import { InjectionToken } from '@angular/core';

/**
 * Vordefinierte Konfigurationen für typische Einsatzzwecke.
 * - comment: Freitext (z.B. Kommentare), ohne Überschriften.
 * - document: Strukturierte Inhalte (z.B. Briefe, PDF), mit semantischen Überschriften.
 */
export type LuxQuillPreset = 'comment' | 'document';

/**
 * Steuert Darstellung und HTML-Semantik der Überschriften.
 * - none: Keine Überschriften. Eingefügte Überschriften werden zu normalem Text.
 * - visual: Rein visuelle Überschriften (`<p class="lux-quill-heading-1">`).
 * - semantic: Semantische Überschriften (`<h1 class="lux-quill-heading-1">`), die Ebene steuert headingLevels.
 */
export type LuxQuillHeadingMode = 'none' | 'visual' | 'semantic';

export type LuxQuillHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type LuxQuillToolbarItem = 'heading' | 'bold' | 'italic' | 'underline' | 'bulletList' | 'orderedList' | 'outdent' | 'indent' | 'link' | 'clean';

export interface LuxQuillConfig {
  /** Darstellung und Semantik der Überschriften. */
  headingMode: LuxQuillHeadingMode;
  /**
   * HTML-Ebenen für "Überschrift 1" und "Überschrift 2" (nur bei headingMode 'semantic').
   * Beispiel: [2, 3] erzeugt `<h2>` und `<h3>`, die Optik bleibt die von Überschrift 1 und 2.
   */
  headingLevels: [LuxQuillHeadingLevel, LuxQuillHeadingLevel];
  /** Einträge und Reihenfolge der Toolbar. Formate ohne Toolbar-Eintrag sind im Editor nicht erlaubt. */
  toolbar: LuxQuillToolbarItem[];
  /** Zusätzliche, über Quill.register(...) registrierte Quill-Formate (Erweiterung). */
  formats: string[];
  /** Zusätzliche Quill-Module bzw. Modul-Optionen (Erweiterung). */
  modules: Record<string, unknown>;
}

export const LUX_QUILL_DEFAULT_TOOLBAR: readonly LuxQuillToolbarItem[] = [
  'heading',
  'bold',
  'italic',
  'underline',
  'bulletList',
  'orderedList',
  'outdent',
  'indent',
  'link',
  'clean'
];

export const LUX_QUILL_PRESET_COMMENT: Readonly<LuxQuillConfig> = {
  headingMode: 'none',
  headingLevels: [1, 2],
  toolbar: [...LUX_QUILL_DEFAULT_TOOLBAR],
  formats: [],
  modules: {}
};

export const LUX_QUILL_PRESET_DOCUMENT: Readonly<LuxQuillConfig> = {
  headingMode: 'semantic',
  headingLevels: [1, 2],
  toolbar: [...LUX_QUILL_DEFAULT_TOOLBAR],
  formats: [],
  modules: {}
};

export const LUX_QUILL_PRESETS: Readonly<Record<LuxQuillPreset, Readonly<LuxQuillConfig>>> = {
  comment: LUX_QUILL_PRESET_COMMENT,
  document: LUX_QUILL_PRESET_DOCUMENT
};

/**
 * App-weite Vorgaben für alle lux-quill-Editoren.
 * Sie überschreiben das Preset und werden selbst von luxConfig überschrieben.
 */
export const LUX_QUILL_CONFIG = new InjectionToken<Partial<LuxQuillConfig>>('LUX_QUILL_CONFIG');

/**
 * Ermittelt die wirksame Konfiguration. Spätere Angaben überschreiben frühere eigenschaftsweise
 * (Arrays und Objekte werden ersetzt, nicht gemischt).
 */
export function luxQuillResolveConfig(preset: LuxQuillPreset, ...overrides: (Partial<LuxQuillConfig> | null | undefined)[]): LuxQuillConfig {
  const config: LuxQuillConfig = { ...(LUX_QUILL_PRESETS[preset] ?? LUX_QUILL_PRESET_COMMENT) };

  overrides.forEach((override) => {
    if (!override) {
      return;
    }
    (Object.keys(override) as (keyof LuxQuillConfig)[]).forEach((key) => {
      if (override[key] !== undefined) {
        (config as unknown as Record<string, unknown>)[key] = override[key];
      }
    });
  });

  return config;
}
