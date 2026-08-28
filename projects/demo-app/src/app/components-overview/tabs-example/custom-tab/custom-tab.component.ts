import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { LuxTabComponent } from '@ihk-gfi/lux-components';
import { DotsLoaderComponent } from './dots-loader.component';

@Component({
  selector: 'custom-tab',
  templateUrl: './custom-tab.component.html',
  styleUrls: ['./custom-tab.component.scss'],
  providers: [{ provide: LuxTabComponent, useExisting: CustomTabComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DotsLoaderComponent]
})
export class CustomTabComponent extends LuxTabComponent implements OnInit {
  @ViewChild(TemplateRef) myContentTemplate!: TemplateRef<any>;

  isLoaded = false;

  ngOnInit() {
    // Angular (seit v17/v18) ruft die Lifecycle-Hooks (ngOnInit, ngAfterViewInit, etc.) für alle Komponenten auf,
    // sobald sie instanziiert werden – auch wenn sie per *ngIf, *ngSwitch oder Lazy Loading noch nicht sichtbar sind.
    // D.h. hier sollte kein Code stehen, der nur ausgeführt werden soll, wenn der Tab tatsächlich aktiviert bzw. angezeigt wird.
    this.luxTitle.set('Beispiel 3');
    this.luxTagIdHeader.set('tab-beispiel3-header');
    this.luxTagIdContent.set('tab-beispiel3-content');
  }

  override getContentTemplate() {
    return this.myContentTemplate;
  }

  override onTabActivated() {
    if (!this.isLoaded) {
      this.loadData();
    }
  }

  private loadData() {
    // Simuliere einen Backend-Aufruf
    setTimeout(() => {
      this.isLoaded = true;
    }, 5000);
  }
}
