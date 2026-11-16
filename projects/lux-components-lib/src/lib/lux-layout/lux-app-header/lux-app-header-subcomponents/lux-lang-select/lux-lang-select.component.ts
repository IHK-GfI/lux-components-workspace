import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { CookieService } from 'ngx-cookie-service';
import { LuxMenuItemComponent } from '../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuComponent } from '../../../../lux-action/lux-menu/lux-menu.component';
import { LuxLocale } from './lux-locale';

@Component({
  selector: 'lux-lang-select',
  templateUrl: './lux-lang-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxMenuComponent, LuxMenuItemComponent, TranslocoPipe]
})
export class LuxLangSelectComponent implements OnInit {
  readonly luxLocaleSupported = input(['de']);
  readonly luxLocaleBaseHref = input('');

  cookieName = 'X-GFI-LANGUAGE';
  cookiePath = '/';

  allSupportedLocaleArr: LuxLocale[] = [
    { code: 'de', label: 'Deutsch', labelSelected: 'DE', path: '' },
    { code: 'en', label: 'English', labelSelected: 'EN', path: '/en' },
    { code: 'fr', label: 'Français', labelSelected: 'FR', path: '/fr' }
  ];

  localeOptions: LuxLocale[] = [];

  private cookieService = inject(CookieService);
  protected translocoService = inject(TranslocoService);

  ngOnInit() {
    this.luxLocaleSupported().forEach((locale) => {
      const foundLocale = this.allSupportedLocaleArr.find((item) => item.code === locale);
      if (foundLocale) {
        this.localeOptions.push(foundLocale);
      }
    });

    let locale = this.cookieService.get(this.cookieName);
    if (!locale || !this.allSupportedLocaleArr.find((item) => item.code === locale)) {
      locale = 'de';
    }
    const newLocale = this.allSupportedLocaleArr.find((item) => item.code === locale);
    if (newLocale) {
      this.activateLocale(newLocale.code);
    }
  }

  onLocaleChanged(locale: LuxLocale) {
    this.activateLocale(locale.code, () => this.cookieService.set(this.cookieName, locale.code, undefined, this.cookiePath));
  }

  /**
   * Vor dem Sprachwechsel erst laden, damit Komponenten nicht kurz Keys anzeigen. Schlägt das
   * Laden fehl, wird nicht gewechselt und onActivated nicht aufgerufen: Ohne fallbackLang bleibt
   * die bisherige Sprache aktiv, mit fallbackLang aktiviert Transloco selbst die Fallback-Sprache.
   */
  private activateLocale(code: string, onActivated?: () => void) {
    this.translocoService.load(code).subscribe({
      next: () => {
        // Mit fallbackLang liefert load() bei einem Fehler die Fallback-Übersetzungen; die
        // angeforderte Sprache ist dann nicht geladen.
        if (!this.translocoService.getTranslation().has(code)) {
          return;
        }
        this.translocoService.setActiveLang(code);
        onActivated?.();
      },
      error: () => undefined
    });
  }
}
