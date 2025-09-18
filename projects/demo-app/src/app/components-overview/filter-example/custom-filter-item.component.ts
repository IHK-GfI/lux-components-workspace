import { AfterViewInit, Component, inject, input, viewChildren } from '@angular/core';
import { LuxFilterFormComponent, LuxFilterItemDirective, LuxInputAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-custom-filter-item',
  imports: [LuxInputAcComponent, LuxFilterItemDirective, LuxToggleAcComponent],
  templateUrl: './custom-filter-item.component.html',
  host: { class: 'lux-grid lux-grid-cols-12 lt-md:lux-grid-cols-1 lux-gap-4 lux-mt-4 lux-items-center' }
})
export class CustomFilterItemComponent implements AfterViewInit {
  filterDisabled = input<boolean>(true);
  filterHidden = input<boolean>(false);

  filterFormComponent = inject(LuxFilterFormComponent);

  formElements = viewChildren(LuxFilterItemDirective);

  ngAfterViewInit(): void {
    this.filterFormComponent.registerFilterItems([...this.formElements()]);
  }
}
