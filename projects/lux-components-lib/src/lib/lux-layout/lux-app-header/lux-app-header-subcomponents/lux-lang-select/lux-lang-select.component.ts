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
      this.translocoService.setActiveLang(locale);
    }
  }

  onLocaleChanged(locale: LuxLocale) {
    this.cookieService.set(this.cookieName, locale.code, undefined, this.cookiePath);
    this.translocoService.setActiveLang(locale.code);
  }
}
