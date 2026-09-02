import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxInputAcSuffixComponent,
    LuxLookupLabelComponent,
    LuxProgressComponent,
    LuxSelectAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-lookup-label-example',
  templateUrl: './lookup-label-example.component.html',
  styleUrls: ['./lookup-label-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxLookupLabelComponent,
    LuxProgressComponent,
    LuxSelectAcComponent,
    LuxInputAcSuffixComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class LookupLabelExampleComponent implements OnInit {
  readonly knr = signal(0);
  readonly tableKey = signal(4);
  readonly tableNo = signal('1002');
  readonly bezeichnung = signal('kurz');
  readonly disabled = signal(true);

  ngOnInit(): void {
    setTimeout(() => {
      this.disabled.set(false);
      this.knr.set(101);
    }, 5000);
  }
}
