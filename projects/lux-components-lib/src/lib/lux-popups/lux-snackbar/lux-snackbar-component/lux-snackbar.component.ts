import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxSnackbarColor, LuxSnackbarColors } from '../../../lux-util/lux-colors.enum';
import { LuxUtil } from '../../../lux-util/lux-util';
import { LuxSnackbarConfig } from '../lux-snackbar-config';

@Component({
  selector: 'lux-snackbar',
  templateUrl: './lux-snackbar.component.html',
  imports: [LuxIconComponent, NgClass, MatButton]
})
export class LuxSnackbarComponent implements OnInit {
  config = inject<LuxSnackbarConfig>(MAT_SNACK_BAR_DATA);
  snackbarRef = inject<MatSnackBarRef<LuxSnackbarComponent>>(MatSnackBarRef);

  private action$: Subject<void> = new Subject<void>();

  textFontColor = '';
  actionFontColor = '';
  iconFontColor = '';

  ngOnInit() {
    Object.keys(this.config).forEach((key: string) => {
      if ((this.config as any)[key]) {
        (this.config as any)[key] = (this.config as any)[key].trim();
      }
    });
    // stupid-cast, um den string weiterzugeben, da die fn daraus den enum-wert herleiten kann
    this.textFontColor = LuxUtil.getColorsByBgColorsEnum(this.checkColorInEnum(this.config.textColor)).backgroundCSSClass;
    this.actionFontColor = LuxUtil.getColorsByBgColorsEnum(this.checkColorInEnum(this.config.actionColor)).backgroundCSSClass;
    this.iconFontColor = LuxUtil.getColorsByBgColorsEnum(this.checkColorInEnum(this.config.iconColor)).backgroundCSSClass;
  }

  onAction(): Observable<void> {
    return this.action$.asObservable();
  }

  actionClick() {
    this.snackbarRef.dismiss();
    this.action$.next();
  }

  /**
   * Prüft, ob die übergebene Farbe Teil des Enums ist.
   * Wenn nicht, wird standardmäßig "gray" zurückgegeben.
   * @param colorToCheck
   */
  private checkColorInEnum(colorToCheck: string | undefined): LuxSnackbarColor {
    const found = LuxSnackbarColors.find((entry) => entry === colorToCheck);
    return found ?? 'white';
  }
}
