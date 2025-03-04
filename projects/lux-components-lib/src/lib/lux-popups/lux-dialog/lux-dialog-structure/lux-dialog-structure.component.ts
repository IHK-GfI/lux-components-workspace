import { CdkScrollable } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxUtil } from '../../../lux-util/lux-util';
import { LuxDialogRef } from '../lux-dialog-model/lux-dialog-ref.class';

/**
 * Diese Component stellt eine Grundstruktur für Dialoge dar und kann von Aufrufern als Alternative
 * zu LuxDialogPresetComponent genutzt werden (wenn andere Inhalte, etc. gewünscht sind).
 */
@Component({
  selector: 'lux-dialog-structure',
  templateUrl: './lux-dialog-structure.component.html',
  imports: [LuxAriaLabelDirective, LuxIconComponent, MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions]
})
export class LuxDialogStructureComponent implements OnInit, AfterViewInit {
  private luxDialogRef = inject<LuxDialogRef<any>>(LuxDialogRef);

  @ViewChild('dialogBase', { read: ElementRef, static: true }) dialogBase!: ElementRef;

  disableClose!: boolean;

  private _iconName = '';
  @Input() set luxDialogIcon(name: string | undefined) {
    if (name) this._iconName = name;
  }
  get luxDialogIcon() {
    return this._iconName;
  }

  ngOnInit() {
    this.disableClose = this.luxDialogRef?._matDialogRef?.disableClose ?? false;
  }

  ngAfterViewInit() {
    LuxUtil.assertNonNull('dialogBase', this.dialogBase);

    // den Fokus auf den Dialog selbst setzen (damit eine Tastatur-Steuerung von oben nach unten stattfinden kann)
    (this.dialogBase.nativeElement as HTMLHeadingElement).focus();
  }

  onClose() {
    this.luxDialogRef.closeDialog();
  }
}
