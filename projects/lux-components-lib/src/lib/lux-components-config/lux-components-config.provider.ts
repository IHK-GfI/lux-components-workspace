import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { LuxComponentsConfigParameters } from './lux-components-config-parameters.interface';

// Diesen bitte !nicht! injecten, sondern den LuxComponentsConfigService.
export const LuxConfigTokenService = new InjectionToken<LuxComponentsConfigParameters>('luxConfig');

/**
 * Registriert die übergebene Konfiguration für die LuxComponents.
 * Muss in den Providern der ApplicationConfig (app.config.ts) bzw. des AppModules eingetragen werden.
 */
export function provideLuxComponentsConfig(config: LuxComponentsConfigParameters): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LuxConfigTokenService,
      useValue: config
    }
  ]);
}
