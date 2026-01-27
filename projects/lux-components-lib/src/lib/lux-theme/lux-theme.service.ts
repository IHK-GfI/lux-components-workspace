import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LuxConsoleService } from '../lux-util/lux-console.service';
import { LuxStorageService } from '../lux-util/lux-storage.service';
import { LuxTheme } from './lux-theme';

@Injectable({
  providedIn: 'root'
})
export class LuxThemeService {
  private storageService = inject(LuxStorageService);

  private readonly storageKeyThemeName = 'lux.app.theme.name';
  private themes: LuxTheme[];
  private theme$: BehaviorSubject<LuxTheme>;

  constructor() {
    this.themes = [
      { name: 'authentic', styleUrl: 'assets/themes/luxtheme-authentic-min.css' },
      { name: 'green', styleUrl: 'assets/themes/luxtheme-green-min.css' }
    ];

    this.theme$ = new BehaviorSubject<LuxTheme>(this.getInitTheme());
  }

  getThemeAsObservable(): Observable<LuxTheme> {
    return this.theme$.asObservable();
  }

  getTheme(): LuxTheme {
    return this.theme$.getValue();
  }

  setTheme(themeName: string) {
    this.theme$.next(this.findTheme(themeName));
    this.storageService.setItem(this.storageKeyThemeName, themeName, false);
    this.loadTheme();
  }

  private findTheme(themeName: string): LuxTheme {
    const newTheme = this.themes.find((theme) => theme.name === themeName);

    if (!newTheme) {
      throw Error(`Theme "${themeName}" not found.`);
    }

    return newTheme;
  }

  setThemes(themes: LuxTheme[]) {
    this.themes = themes;
  }

  loadTheme() {
    this.loadStyle(this.getTheme().styleUrl).then(() => {
      LuxConsoleService.LOG(`LUX-Theme "${this.getTheme().name}" selected.`);
    });
  }

  loadStyle(stylesUrl: string, parent: HTMLElement = document.head) {
    return new Promise<HTMLLinkElement>((resolve, reject) => {
      // Zuerst das alte Theme entfernen
      const links = parent.getElementsByTagName('link');
      if (links) {
        for (const link of links) {
          const hrefAttr = link.getAttribute('href');
          if (hrefAttr && hrefAttr.indexOf('luxtheme-') >= 0 && hrefAttr.indexOf('.css') >= 0) {
            parent.removeChild(link);
          }
        }
      }

      // Das neue Theme hinzufügen
      const link = document.createElement('link') as HTMLLinkElement;
      link.rel = 'stylesheet';
      link.href = stylesUrl;
      link.type = 'text/css';
      link.onerror = reject;
      link.onload = () => resolve(link);
      parent.appendChild(link);
    });
  }

  private getInitTheme() {
    let theme;

    // Prüfe, ob im Storage ein Themename hinterlegt ist.
    const storedThemeName = this.storageService.getItem(this.storageKeyThemeName);
    if (storedThemeName) {
      const selectedTheme = this.themes.find((currentTheme) => currentTheme.name === storedThemeName);
      if (selectedTheme) {
        theme = selectedTheme;
      }
    }

    // Wenn kein Theme hinterlegt wurde, nimm das erste verfügbare Theme.
    if (!theme) {
      theme = this.themes[0];
    }

    return theme;
  }
}
