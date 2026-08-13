import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { TenantLogoExampleConfigData } from './tenant-logo-example-config/tenant-logo-example-config-data';

@Injectable({
  providedIn: 'root'
})
export class TenantLogoExampleHeaderService {
  public tenantConfigChange: EventEmitter<TenantLogoExampleConfigData> = new EventEmitter<TenantLogoExampleConfigData>();

  public showBorderForTenantImage(el: ElementRef, toggle: boolean) {
    let c = el.nativeElement.querySelector('img');

    if (!c) {
      c = el.nativeElement.querySelector('.lux-tenant-logo-error');
    }

    if (c) {
      c.style.border = toggle ? '2px solid red' : '';
    }
  }
}
