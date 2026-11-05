import { AfterViewInit, Component, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tabs-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs-example-content.component.html'
})
export class TabsExampleContentComponent implements AfterViewInit {
  readonly created = output<void>();

  ngAfterViewInit() {
    this.created.emit();
  }
}
