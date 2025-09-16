import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LuxTabComponent } from '@ihk-gfi/lux-components';
import { DotsLoaderComponent } from './dots-loader.component';

@Component({
  selector: 'custom-tab',
  templateUrl: './custom-tab.component.html',
  styleUrls: ['./custom-tab.component.scss'],
  providers: [{ provide: LuxTabComponent, useExisting: CustomTabComponent }],
  imports: [DotsLoaderComponent]
})
export class CustomTabComponent extends LuxTabComponent implements OnInit, AfterViewInit {
  @ViewChild(TemplateRef) myContentTemplate!: TemplateRef<any>;

  isLoaded = false;

  ngOnInit() {
    // Angular (seit v17/v18) ruft die Lifecycle-Hooks (ngOnInit, ngAfterViewInit, etc.) für alle Komponenten auf,
    // sobald sie instanziiert werden – auch wenn sie per *ngIf, *ngSwitch oder Lazy Loading noch nicht sichtbar sind.
    // D.h. hier sollte kein Code stehen, der nur ausgeführt werden soll, wenn der Tab tatsächlich aktiviert bzw. angezeigt wird.
    this.luxTitle = 'Beispiel 3';
    this.luxTagIdHeader = 'tab-beispiel3-header';
    this.luxTagIdContent = 'tab-beispiel3-content';
  }

  ngAfterViewInit() {
    // Siehe Kommentar in ngOnInit()
    this.contentTemplate = this.myContentTemplate;
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
