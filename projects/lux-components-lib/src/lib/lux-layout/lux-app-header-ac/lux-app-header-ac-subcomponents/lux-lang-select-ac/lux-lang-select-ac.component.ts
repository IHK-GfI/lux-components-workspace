import { NgClass } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { CookieService } from 'ngx-cookie-service';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxMenuItemComponent } from '../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuTriggerComponent } from '../../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-trigger.component';
import { LuxMenuComponent } from '../../../../lux-action/lux-menu/lux-menu.component';
import { LuxAriaLabelDirective } from '../../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxTooltipDirective } from '../../../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxLocaleAc } from './lux-locale-ac';

@Component({
  selector: 'lux-lang-select-ac',
  templateUrl: './lux-lang-select-ac.component.html',
  imports: [
    LuxAriaLabelDirective,
    LuxTooltipDirective,
    NgClass,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxMenuTriggerComponent,
    LuxButtonComponent,
    TranslocoPipe
  ]
})
export class LuxLangSelectAcComponent implements OnInit {
  private cookieService = inject(CookieService);
  protected translocoService = inject(TranslocoService);

  @Input() luxLocaleSupported = ['de'];
  @Input() luxLocaleBaseHref = '';
  @Input() mobileView = false;

  @ViewChild('customTrigger', { read: ElementRef }) customTrigger?: ElementRef;

  menuOpened = false;

  cookieName = 'X-GFI-LANGUAGE';
  cookiePath = '/';

  // Hinweis: Transloco ist aktuell (App-Konfiguration) nur für 'de' und 'en' konfiguriert.
  // 'fr' ist hier vorerst ausgeblendet, um fehlende Übersetzungen nach Sprachwechsel zu vermeiden.
  allSupportedLocaleArr: LuxLocaleAc[] = [
    { code: 'de', label: 'Deutsch', labelSelected: 'DE', path: '' },
    { code: 'en', label: 'English', labelSelected: 'EN', path: '/en' }
  ];

  localeOptions: LuxLocaleAc[] = [];

  ngOnInit() {
    this.luxLocaleSupported.forEach((locale) => {
      const foundLocale = this.allSupportedLocaleArr.find((item) => item.code === locale);
      if (foundLocale) {
        this.localeOptions.push(foundLocale);
      }
    });

    let locale = this.cookieService.get(this.cookieName);
    if (!locale || !this.localeOptions.find((item) => item.code === locale)) {
      locale = 'de';
    }
    const newLocale = this.localeOptions.find((item) => item.code === locale);
    if (newLocale) {
      // Sicherstellen, dass Übersetzungen nach Lazy-Nachladen vorhanden sind
      this.translocoService
        .load(newLocale.code)
        .subscribe({
          next: () => this.translocoService.setActiveLang(newLocale!.code),
          error: () => this.translocoService.setActiveLang('de')
        });
    }
  }

  onLocaleChanged(locale: LuxLocaleAc) {
    // Vor Sprachwechsel: erst laden, dann aktivieren, damit Komponenten nicht kurz Keys anzeigen.
    this.translocoService
      .load(locale.code)
      .subscribe({
        next: () => {
          this.cookieService.set(this.cookieName, locale.code, undefined, this.cookiePath);
          this.translocoService.setActiveLang(locale.code);
        },
        error: () => {
          // Fallback: Cookie nicht setzen, bei Fehler auf Default zurück.
          this.translocoService.setActiveLang('de');
        }
      });
  }

  onMenuOpened() {
    this.menuOpened = true;
  }
  onMenuClosed() {
    this.menuOpened = false;
    if (this.customTrigger) {
      this.customTrigger.nativeElement.children[0].focus();
    }
  }
}
