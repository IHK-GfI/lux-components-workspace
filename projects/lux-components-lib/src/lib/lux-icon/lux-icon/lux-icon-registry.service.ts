import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { isTestEnv } from '../../lux-util/env-utils';
import iconFilesJson from './lux-icons.json';
import { LuxSvgIcon } from './lux-svg-icon';

@Injectable({
  providedIn: 'root'
})
export class LuxIconRegistryService {
  private matIconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private configService = inject(LuxComponentsConfigService);

  private registeredIcons = new Array<string>();
  private svgIcons: LuxSvgIcon[] = iconFilesJson;
  private iconBasePath = '';

  constructor() {
    this.iconBasePath = this.configService.currentConfig.iconBasePath ?? '';
    if (this.iconBasePath.endsWith('/')) {
      this.iconBasePath = this.iconBasePath.substring(0, this.iconBasePath.length - 1);
    }
  }

  registerIcon(iconName: string) {
    const requested = iconName.toLowerCase();
    const icon = this.svgIcons.find((item) => this.normalizeIconName(item.iconName) === requested);

    if (icon) {
      if (!this.registeredIcons.includes(iconName)) {
        if (isTestEnv()) {
          // In unit tests, avoid real HTTP requests by registering a minimal inline SVG.
          // This prevents MatIconRegistry from issuing GET requests to external asset URLs.
          this.matIconRegistry.addSvgIconLiteral(
            iconName,
            this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
          );
        } else {
          const iconPath = this.getIconBasePath(icon) + icon.iconPath;
          this.matIconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl(iconPath));
        }
        this.registeredIcons.push(iconName);
      }
    } else {
      throw new Error(`Unbekanntes Icon: ${iconName}`);
    }
  }

  getSvgIconList(): LuxSvgIcon[] {
    return this.svgIcons;
  }

  private normalizeIconName(iconName: string): string {
    return iconName.split('--')[0].toLowerCase();
  }

  private getIconBasePath(icon: LuxSvgIcon): string {
    let basePath = icon.iconBasePath !== undefined ? icon.iconBasePath : this.iconBasePath;

    if (basePath === '/') {
      basePath = '';
    }

    return basePath;
  }
}
