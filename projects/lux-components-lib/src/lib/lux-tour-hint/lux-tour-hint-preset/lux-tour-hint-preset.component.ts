import { Component, inject } from '@angular/core';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxCheckboxAcComponent } from '../../lux-form/lux-checkbox-ac/lux-checkbox-ac.component';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxTourHintRef } from '../lux-tour-hint-model/lux-tour-hint-ref.class';

@Component({
  selector: 'lux-tour-hint-preset',
  templateUrl: './lux-tour-hint-preset.component.html',
  styleUrls: ['./lux-tour-hint-preset.component.scss'],
  imports: [LuxIconComponent, LuxCheckboxAcComponent, LuxButtonComponent]
})
export class LuxTourHintPresetComponent {
  tourRef = inject(LuxTourHintRef);

  public dontShowAgainChecked = false;

  public close() {
    this.tourRef.close(this.dontShowAgainChecked);
  }
}
