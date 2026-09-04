import { AfterViewInit, Component, inject, input, viewChildren, ChangeDetectionStrategy } from '@angular/core';
import { LuxFilterFormComponent, LuxFilterItemDirective, LuxInputAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-custom-filter-item',
  imports: [LuxInputAcComponent, LuxFilterItemDirective, LuxToggleAcComponent],
  templateUrl: './custom-filter-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lux-grid lux-grid-cols-12 lt-md:lux-grid-cols-1 lux-gap-4 lux-mt-4 lux-items-center' }
})
export class CustomFilterItemComponent implements AfterViewInit {
  readonly filterDisabled = input<boolean>(true);
  readonly filterHidden = input<boolean>(false);

  readonly formElements = viewChildren(LuxFilterItemDirective);

  private filterFormComponent = inject(LuxFilterFormComponent);

  ngAfterViewInit(): void {
    this.filterFormComponent.registerFilterItems([...this.formElements()]);
  }
}
