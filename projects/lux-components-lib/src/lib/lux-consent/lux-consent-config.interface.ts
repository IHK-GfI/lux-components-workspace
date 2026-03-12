import { Type } from '@angular/core';
import { LuxConsentEntry } from './lux-consent.model';

export interface ILuxConsentConfig {
  cookieKey: string;
  consentCookieDurationDays?: number;
  /** Optional additional entries provided by the host app; merged with defaults by the service. */
  entries?: LuxConsentEntry[];
  impressumUrl?: string;
  impressumComponent?: Type<unknown>;
  impressumComponentLoader?: () => Promise<Type<unknown>>;
  impressumComponentInputs?: Record<string, unknown>;
  datenschutzUrl?: string;
  datenschutzComponent?: Type<unknown>;
  datenschutzComponentLoader?: () => Promise<Type<unknown>>;
  datenschutzComponentInputs?: Record<string, unknown>;
}
