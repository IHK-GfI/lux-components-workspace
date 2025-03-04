import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { LuxTenantLogoComponent, LuxToggleAcComponent } from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { TenantLogoExampleConfigData } from './tenant-logo-example-config/tenant-logo-example-config-data';
import { TenantLogoExampleConfigComponent } from './tenant-logo-example-config/tenant-logo-example-config.component';
import { TenantLogoExampleHeaderService } from './tenant-logo-example-header.service';

@Component({
  selector: 'app-tenant-logo-example',
  templateUrl: './tenant-logo-example.component.html',
  styleUrls: ['./tenant-logo-example.component.scss'],
  imports: [
    LuxTenantLogoComponent,
    LuxToggleAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    TenantLogoExampleConfigComponent
  ]
})
export class TenantLogoExampleComponent {
  private tenantLogoHeaderService = inject(TenantLogoExampleHeaderService);

  @ViewChild('exampleLogo', { read: ElementRef })
  private tenantRef!: ElementRef;

  public useTenantLogoForHeader = false;

  public headerTenantLogoConfig: TenantLogoExampleConfigData = {
    luxTenantKey: '100',
    luxTenantVariant: '',
    luxTenantLogoHeight: '',
    luxTenantLogoClicked: undefined
  };

  public localTenantLogoConfig: TenantLogoExampleConfigData = {
    luxTenantKey: '100',
    luxTenantVariant: '',
    luxTenantLogoHeight: '100px',
    luxTenantLogoClicked: undefined
  };

  public onChangeUseTenantLogoForHeader(toggle: boolean) {
    this.useTenantLogoForHeader = toggle;
    if (toggle) {
      this.tenantLogoHeaderService.tenantConfigChange.emit(this.headerTenantLogoConfig);
    } else {
      this.tenantLogoHeaderService.tenantConfigChange.emit(undefined);
    }
  }

  public onChangeShowBorderForImages(toggle: boolean) {
    this.tenantLogoHeaderService.showBorderForTenantImage(this.tenantRef, toggle);
  }

  public onTenenatLogoClicked(config: TenantLogoExampleConfigData) {
    if (config.luxTenantLogoClicked) {
      config.luxTenantLogoClicked();
    }
  }
}
