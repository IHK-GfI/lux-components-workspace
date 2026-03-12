import { LuxConsentPurpose, LuxCookieCategory } from './lux-consent.model';

export const LUX_CONSENT_CATEGORIES: LuxCookieCategory[] = [
  {
    purpose: LuxConsentPurpose.Essential,
    name: 'luxc.consent.essential.name',
    enabled: true,
    disabled: true,
    hint: 'luxc.consent.essential.hint'
  },
  {
    purpose: LuxConsentPurpose.Preferences,
    name: 'luxc.consent.preferences.name',
    enabled: false,
    disabled: false,
    hint: 'luxc.consent.preferences.hint'
  },
  {
    purpose: LuxConsentPurpose.Statistics,
    name: 'luxc.consent.statistics.name',
    enabled: false,
    disabled: false,
    hint: 'luxc.consent.statistics.hint'
  },
  {
    purpose: LuxConsentPurpose.Marketing,
    name: 'luxc.consent.marketing.name',
    enabled: false,
    disabled: false,
    hint: 'luxc.consent.marketing.hint'
  },
  {
    purpose: LuxConsentPurpose.Other,
    name: 'luxc.consent.other.name',
    enabled: false,
    disabled: false,
    hint: 'luxc.consent.other.hint'
  }
];

export default LUX_CONSENT_CATEGORIES;
