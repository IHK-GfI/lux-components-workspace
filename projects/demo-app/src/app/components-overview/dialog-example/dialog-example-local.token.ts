import { InjectionToken } from '@angular/core';

/**
 * Demo-Token für Issue #305 (LuxDialog mit eigenem Injector erstellen).
 * Wird lokal auf der "DialogExampleComponent" bereitgestellt, um zu demonstrieren, wie ein
 * solcher lokaler Provider über den `injector`-Parameter von `LuxDialogService.openComponent`
 * in der Dialog-Component injiziert werden kann.
 */
export const DIALOG_EXAMPLE_LOCAL_TOKEN = new InjectionToken<string>('DIALOG_EXAMPLE_LOCAL_TOKEN');
