import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { TenantLogoExampleConfigData } from './tenant-logo-example-config/tenant-logo-example-config-data';

@Injectable({
  providedIn: 'root'
})
export class TenantLogoExampleHeaderService {
  public tenantConfigChange: EventEmitter<TenantLogoExampleConfigData> = new EventEmitter<TenantLogoExampleConfigData>();

  public showBorderForTenantImage(el: ElementRef, toggle: boolean) {
    const c = el.nativeElement.querySelector('img');

    if (toggle) {
      c.style.border = '2px solid red';
    } else {
      c.style.border = '';
    }
  }
}
