export enum LuxConsentPurpose {
  Essential = 'essential',
  Preferences = 'preferences',
  Statistics = 'statistics',
  Marketing = 'marketing',
  Other = 'other'
}

export enum LuxConsentStorageType {
  Cookie = 'Cookie',
  LocalStorage = 'Local Storage',
  SessionStorage = 'Session Storage'
}

export interface LuxConsentEntry {
  type: LuxConsentStorageType;
  name: string;
  /** Wenn true, gilt der `name` als Prefix für dynamische Keys (z. B. "[lux-tour-hint-dsa]") */
  nameIsPrefix?: boolean;
  processingCountry: string;
  purpose: LuxConsentPurpose;
  duration: string;
  description: string;
}

export interface LuxConsentState {
  purposes: LuxConsentPurpose[];
  timestamp: string;
}

export interface LuxCookieCategory {
  purpose: LuxConsentPurpose;
  name: string;
  enabled: boolean;
  disabled: boolean;
  hint: string;
}
