import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { ILuxMessage } from '../../lux-common/lux-message-box/lux-message-box-model/lux-message.interface';
import { LuxMessageBoxComponent } from '../../lux-common/lux-message-box/lux-message-box.component';
import { LuxHttpErrorInterceptor } from './lux-http-error-interceptor';

@Component({
  selector: 'lux-http-error',
  templateUrl: 'lux-http-error.component.html',
  styleUrls: ['lux-http-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxMessageBoxComponent]
})
export class LuxHttpErrorComponent implements AfterViewInit {
  readonly luxMessageBoxClosed = output<void>();

  readonly messageComponent = viewChild.required(LuxMessageBoxComponent);

  readonly errors = signal<ILuxMessage[]>([]);

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Beim Ansteuern einer neuen Route, die aktuellen Fehler resetten.
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        LuxHttpErrorInterceptor.dataStream.next([]);
      }
    });
  }

  ngAfterViewInit() {
    // Wenn neue Fehler-Objekte kommen, diese umformatieren und in der LuxMessageBoxComponent anzeigen.
    LuxHttpErrorInterceptor.dataStream$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((errors: any[]) => {
        this.updateErrors(errors);
      });
  }

  /**
   * Updated das aktuelle Errors-Array mit dem übergebenen Wert.
   * Liest dabei die Message aus dem Fehler und erzeugt LuxMessage-Objekte für die LuxMessageBoxComponent.
   * @param errors
   */
  private updateErrors(errors: any[]) {
    const errorMessages: ILuxMessage[] = [];
    if (errors && errors.length > 0) {
      errors.forEach((error: any) => {
        errorMessages.push({
          text: LuxHttpErrorComponent.readErrorMessage(error),
          color: 'red',
          iconName: 'lux-programming-bug'
        });
      });
    }
    setTimeout(() => {
      this.errors.set(errorMessages);
    });
  }

  /**
   * Versucht eine Fehlermeldung aus dem Fehler zu lesen.
   * Zuerst wird geschaut, ob der Fehler selbst nur ein String ist. Wenn ja, diesen zurückgeben.
   * Dann wird geprüft, ob der Fehler eine "message"-Property besitzt. Wenn ja, diese zurückgeben.
   * Als letzter Ausweg wird das "error"-Objekt selbst über die toString-Methode zurückgegeben.
   * @param error
   */
  private static readErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    } else if (Object.hasOwn(error, 'message')) {
      return error['message'];
    } else {
      return error.toString();
    }
  }
}
