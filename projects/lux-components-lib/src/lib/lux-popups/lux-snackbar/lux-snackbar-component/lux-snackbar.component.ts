import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxSnackbarConfig } from '../lux-snackbar-config';

@Component({
  selector: 'lux-snackbar',
  templateUrl: './lux-snackbar.component.html',
  imports: [LuxIconComponent, MatButton]
})
export class LuxSnackbarComponent implements OnInit {
  config = inject<LuxSnackbarConfig>(MAT_SNACK_BAR_DATA);
  snackbarRef = inject<MatSnackBarRef<LuxSnackbarComponent>>(MatSnackBarRef);

  private action$: Subject<void> = new Subject<void>();

  ngOnInit() {
    Object.keys(this.config).forEach((key: string) => {
      if ((this.config as any)[key]) {
        (this.config as any)[key] = (this.config as any)[key].trim();
      }
    });
  }

  onAction(): Observable<void> {
    return this.action$.asObservable();
  }

  actionClick() {
    this.snackbarRef.dismiss();
    this.action$.next();
  }
}
