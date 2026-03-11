import { Component, inject } from '@angular/core';
import {
  ILuxConsentConfig,
  LuxButtonComponent,
  LuxConsentPurpose,
  LuxConsentService,
  LuxConsentStorageType,
  LuxInputAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-consent-example',
  templateUrl: './consent-example.component.html',
  imports: [
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxInputAcComponent,
    LuxToggleAcComponent,
    LuxButtonComponent
  ]
})
export class ConsentExampleComponent {
  private consentService = inject(LuxConsentService);

  useComponentTargets = true;
  useEssentialOnlyEntries = false;
  impressumUrl = 'https://www.ihk-gfi.de/impressum-5343024';
  datenschutzUrl = 'https://www.ihk-gfi.de/datenschutz-5342920';

  private readonly consentEntries = [
    {
      type: LuxConsentStorageType.LocalStorage,
      name: 'lux.app.theme.name',
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Preferences,
      duration: 'persistent',
      description: 'Speichert das ausgewählte Theme (z. B. "authentic" oder "green").'
    },
    {
      type: LuxConsentStorageType.LocalStorage,
      name: 'lux.app.demo.table',
      nameIsPrefix: true,
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Preferences,
      duration: 'persistent',
      description: 'Speichert, welche Tabellenspalten ausgeblendet wurden.'
    },
    {
      type: LuxConsentStorageType.LocalStorage,
      name: 'lux-app.demo.preferences.localstorage.test',
      nameIsPrefix: true,
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Preferences,
      duration: 'persistent',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      type: LuxConsentStorageType.SessionStorage,
      name: 'lux-app.demo.preferences.session.test',
      nameIsPrefix: true,
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Preferences,
      duration: 'persistent',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      type: LuxConsentStorageType.Cookie,
      name: 'lux-app.demo.preferences.cookietest',
      nameIsPrefix: true,
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Preferences,
      duration: 'persistent',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      type: LuxConsentStorageType.Cookie,
      name: 'lux-app.demo.marketing.test',
      nameIsPrefix: true,
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Marketing,
      duration: 'persistent',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      type: LuxConsentStorageType.SessionStorage,
      name: 'lux-app.demo.statistics.test',
      nameIsPrefix: true,
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Statistics,
      duration: 'persistent',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      type: LuxConsentStorageType.SessionStorage,
      name: 'lux-app.demo.other.test',
      nameIsPrefix: true,
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Other,
      duration: 'persistent',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
  ];

  private readonly essentialOnlyConsentEntries = [
    {
      type: LuxConsentStorageType.LocalStorage,
      name: 'lux.app.required.runtime',
      processingCountry: 'Deutschland',
      purpose: LuxConsentPurpose.Essential,
      duration: 'session',
      description: 'Notwendiger technischer Speicher für den Betrieb der Anwendung.'
    }
  ];

  private get activeConsentEntries() {
    return this.useEssentialOnlyEntries ? this.essentialOnlyConsentEntries : this.consentEntries;
  }

  private get componentConfig(): ILuxConsentConfig {
    return {
      cookieKey: 'lux-app-demo-consent-example',
      impressumComponentLoader: () => import('../../abstract/impressum/impressum.component').then((m) => m.ImpressumComponent),
      datenschutzComponentLoader: () => import('../../abstract/dse/dse.component').then((m) => m.DseComponent),
      impressumComponentInputs: undefined,
      datenschutzComponentInputs: undefined,
      impressumUrl: undefined,
      datenschutzUrl: undefined,
      entries: this.activeConsentEntries
    };
  }

  private get urlConfig(): ILuxConsentConfig {
    return {
      cookieKey: 'lux-app-demo-consent-example',
      impressumComponentLoader: undefined,
      datenschutzComponentLoader: undefined,
      impressumComponentInputs: undefined,
      datenschutzComponentInputs: undefined,
      impressumUrl: this.impressumUrl,
      datenschutzUrl: this.datenschutzUrl,
      entries: this.activeConsentEntries
    };
  }

  get activeTargetLabel() {
    return this.useComponentTargets ? 'Komponenten' : 'URLs';
  }

  get activeEntriesLabel() {
    return this.useEssentialOnlyEntries ? 'Nur essentielle Einträge' : 'Gemischte Einträge';
  }

  openConsent() {
    this.consentService.open(this.useComponentTargets ? this.componentConfig : this.urlConfig);
  }
}
