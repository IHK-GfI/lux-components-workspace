import { Component, ElementRef, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { LuxTenantLogoComponent, LuxToggleComponent } from '@ihk-gfi/lux-components';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxTenantLogoComponent,
    LuxToggleComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    TenantLogoExampleConfigComponent
  ]
})
export class TenantLogoExampleComponent {
  private readonly tenantRef = viewChild('exampleLogo', { read: ElementRef });

  readonly useTenantLogoForHeader = signal(false);

  public headerTenantLogoConfig: TenantLogoExampleConfigData = {
    luxTenantKey: '100',
    luxTenantVariant: '',
    luxTenantLogoHeight: '',
    luxTenantLogoClicked: undefined
  };

  public localTenantLogoConfig: TenantLogoExampleConfigData = {
    luxTenantKey: '100',
    luxTenantVariant: '',
    luxTenantLogoHeight: '50px',
    luxTenantLogoClicked: undefined
  };

  private tenantLogoHeaderService = inject(TenantLogoExampleHeaderService);

  public onChangeUseTenantLogoForHeader(toggle: boolean) {
    this.useTenantLogoForHeader.set(toggle);
    if (toggle) {
      this.tenantLogoHeaderService.tenantConfigChange.emit(this.headerTenantLogoConfig);
    } else {
      this.tenantLogoHeaderService.tenantConfigChange.emit(undefined);
    }
  }

  public onChangeShowBorderForImages(toggle: boolean) {
    const tenantRef = this.tenantRef();
    if (tenantRef) {
      this.tenantLogoHeaderService.showBorderForTenantImage(tenantRef, toggle);
    }
  }

  public onTenenatLogoClicked(config: TenantLogoExampleConfigData) {
    if (config.luxTenantLogoClicked) {
      config.luxTenantLogoClicked();
    }
  }
}
