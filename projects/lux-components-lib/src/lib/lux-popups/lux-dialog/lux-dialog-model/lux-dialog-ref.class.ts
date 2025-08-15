import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class LuxDialogRef<T = any> {
  _matDialogRef!: MatDialogRef<any>;
  _dialogConfirmed = new ReplaySubject<void>(1);
  _dialogDeclined = new ReplaySubject<void>(1);
  _dialogClosed = new ReplaySubject<any>(1);
  _data: any;

  /**
   * Gibt die Component, die in dem Dialog angezeigt wird wieder.
   */
  get componentInstance(): any {
    return this._matDialogRef.componentInstance;
  }

  /**
   * Damit hier ein Wert abgegeben wird, muss "closeDialog" ein Result mit dem Wert "true" übergeben bekommen.
   */
  get dialogConfirmed(): Observable<void> {
    return this._dialogConfirmed.asObservable();
  }

  /**
   * Damit hier ein Wert abgegeben wird, muss "closeDialog" ein Result mit dem Wert "false" übergeben bekommen.
   */
  get dialogDeclined(): Observable<void> {
    return this._dialogDeclined.asObservable();
  }

  /**
   * Wird beim Beenden des Dialogs ausgelöst.
   */
  get dialogClosed(): Observable<any> {
    return this._dialogClosed.asObservable();
  }

  /**
   * Enthält die Daten für die Dialog-Component.
   */
  get data(): T {
    return this._data;
  }

  constructor() {}

  /**
   * (Re-)Initialisiert diese Dialog-Referenz neu.
   * @param matDialogRef
   * @param data
   */
  init(matDialogRef: MatDialogRef<any>, data: any) {
    this._matDialogRef = matDialogRef;
    this._dialogConfirmed = new ReplaySubject(1);
    this._dialogDeclined = new ReplaySubject(1);
    this._dialogClosed = new ReplaySubject(1);
    this._data = data;

    if (!this._matDialogRef.disableClose) {
      this._matDialogRef.backdropClick().subscribe(this.backdropFn(this._dialogClosed));
      this._matDialogRef.keydownEvents().subscribe((event) => {
        if (event.key === 'Escape') {
          this.closeDialog();
        }
      });
    }
  }

  /**
   * @deprecated Wird nicht mehr benötigt, da die Dialogreferenz nicht mehr zwischengespeichert wird.
   */
  storeDialogRef() {
  }

  /**
   * @deprecated Wird nicht mehr benötigt, da die Dialogreferenz nicht mehr zwischengespeichert wird.
   */
  restoreDialogRef() {
  }

  /**
   * Schließt den Dialog und gibt nach Beenden die entsprechenden Events aus.
   * @param result
   */
  closeDialog(result?: any) {
    this._matDialogRef.close(result);
    this._matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult: any) => {
        if (dialogResult === true) {
          this._dialogConfirmed.next();
        } else if (dialogResult === false) {
          this._dialogDeclined.next();
        }
        this._dialogClosed.next(result);
      });
  }

  private backdropFn(dialogClosed: ReplaySubject<void>) {
    const myDialogClosed = dialogClosed;
    return () => {
      myDialogClosed.next(undefined);
    };
  }
}
