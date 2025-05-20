import { ComponentType } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { DEFAULT_DIALOG_CONF, ILuxDialogConfig } from './lux-dialog-model/lux-dialog-config.interface';
import { DEFAULT_DIALOG_PRESET_CONF, ILuxDialogPresetConfig } from './lux-dialog-model/lux-dialog-preset-config.interface';
import { LuxDialogRef } from './lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogPresetComponent } from './lux-dialog-preset/lux-dialog-preset.component';

@Injectable({
  providedIn: 'root'
})
export class LuxDialogService {
  private matDialog = inject(MatDialog);
  private logger = inject(LuxConsoleService);
  private luxDialogRef = inject<LuxDialogRef<any>>(LuxDialogRef);

  private static readonly ALREADY_OPENED_ERROR: string = 'Aktuell ist bereits ein Dialog geöffnet';

  private dialogOpened = false;

  /**
   * Öffnet einen Dialog basierend auf der übergebenen Component und den entsprechenden Daten.
   * @param component
   * @param config
   * @param data
   */
  openComponent<T>(component: ComponentType<any>, config?: ILuxDialogConfig, data?: T): LuxDialogRef<T> {
    this.handleOpen(component, config, data, DEFAULT_DIALOG_CONF);
    return this.luxDialogRef;
  }

  /**
   *  Siehe LuxDialogRef.storeDialogRef
   */
  storeDialogRef() {
    this.luxDialogRef.storeDialogRef();
  }

  /**
   * Siehe LuxDialogRef.restoreDialogRef
   */
  restoreDialogRef() {
    this.luxDialogRef.restoreDialogRef();
  }

  /**
   * Öffnet einen Dialog basierend auf der LuxDialogComponent und der LuxDialogConfig.
   * @param config
   */
  open<T>(config?: ILuxDialogPresetConfig): LuxDialogRef<T> {
    // Eine Dialog-Instanz erzeugen, als Data übergeben wir hier noch einmal die Config
    this.handleOpen(LuxDialogPresetComponent, config, config, DEFAULT_DIALOG_PRESET_CONF);
    return this.luxDialogRef;
  }

  /**
   * Prüft, ob bereits ein Dialog geöffnet ist und etwaige CSS-Klassen für den Dialog gegeben sind.
   * Anschließend wird der Dialog mit den übergebenen Config-Optionen und Data-Informationen geöffnet.
   * @param component
   * @param config
   * @param data
   * @param defaultConfig
   */
  private handleOpen(
    component: ComponentType<any>,
    config?: ILuxDialogConfig,
    data?: any,
    defaultConfig: ILuxDialogConfig | ILuxDialogPresetConfig = DEFAULT_DIALOG_CONF
  ) {
    if (!this.dialogOpened) {
      // Wenn keine Config übergeben ist, die defaultConfig nehmen
      config = config ? config : defaultConfig;

      // Die CSS-Klassen fürs Panel herausfinden
      const panelClass = ['lux-dialog'];
      if (config.panelClass) {
        if (Array.isArray(config.panelClass)) {
          panelClass.push(...config.panelClass);
        } else {
          panelClass.push(config.panelClass);
        }
      }

      // Workaround: https://github.com/IHK-GfI/lux-components-workspace/issues/3
      // Blocked aria-hidden on an element because its descendant retained focus. 
      // The focus must not be hidden from assistive technology users. 
      // Avoid using aria-hidden on a focused element or its ancestor. 
      // Consider using the inert attribute instead, which will also prevent focus. 
      // For more details, see the aria-hidden section of the WAI-ARIA specification at https://w3c.github.io/aria/#aria-hidden.
      // Element with focus: ...
      // Ancestor with aria-hidden: <app-root>
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }

      // Dialog öffnen und Konfiguration übergeben
      const matDialogRef = this.matDialog.open(component, {
        width: config.width,
        height: config.height,
        autoFocus: false,
        restoreFocus: true,
        disableClose: config.disableClose,
        panelClass
      });

      matDialogRef.afterClosed().subscribe(() => {
        if (activeElement) {
          activeElement.focus();
        }
      });

      this.luxDialogRef.init(matDialogRef, data);
    } else {
      this.logger.error(LuxDialogService.ALREADY_OPENED_ERROR);
    }
  }
}
