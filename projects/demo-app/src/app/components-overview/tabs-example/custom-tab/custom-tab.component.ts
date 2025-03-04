import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { LuxTabComponent } from 'lux-components-lib';

@Component({
  selector: 'custom-tab',
  templateUrl: './custom-tab.component.html',
  providers: [{ provide: LuxTabComponent, useExisting: CustomTabComponent }]
})
export class CustomTabComponent extends LuxTabComponent implements OnInit, AfterViewInit {
  elementRef = inject(ElementRef);

  @ViewChild(TemplateRef) myContentTemplate!: TemplateRef<any>;

  ngOnInit() {
    this.luxTitle = 'Beispiel 3';
    this.luxTagIdHeader = 'tab-beispiel3-header';
    this.luxTagIdContent = 'tab-beispiel3-content';
  }

  override ngAfterViewInit() {
    setTimeout(() => {
      this.contentTemplate = this.myContentTemplate;
    });
  }
}
