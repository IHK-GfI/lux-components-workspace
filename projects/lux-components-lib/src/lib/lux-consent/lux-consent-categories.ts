import { LuxConsentPurpose, LuxCookieCategory } from './lux-consent.model';

export const LUX_CONSENT_CATEGORIES: LuxCookieCategory[] = [
  {
    purpose: LuxConsentPurpose.Essential,
    name: $localize`:@@luxc.consent.essential.name:Notwendig`,
    enabled: true,
    disabled: true,
    hint: $localize`:@@luxc.consent.essential.hint:Notwendige Cookies helfen dabei, eine Webseite nutzbar zu machen, indem sie Grundfunktionen wie Seitennavigation und Zugriff auf sichere Bereiche der Webseite ermöglichen. Die Webseite kann ohne diese Cookies nicht richtig funktionieren.`
  },
  {
    purpose: LuxConsentPurpose.Preferences,
    name: $localize`:@@luxc.consent.preferences.name:Präferenzen`,
    enabled: false,
    disabled: false,
    hint: $localize`:@@luxc.consent.preferences.hint:Präferenz-Cookies ermöglichen einer Webseite sich an Informationen zu erinnern, die die Art beeinflussen, wie sich eine Webseite verhält oder aussieht, wie z. B. Ihre bevorzugte Sprache oder die Region in der Sie sich befinden.`
  },
  {
    purpose: LuxConsentPurpose.Statistics,
    name: $localize`:@@luxc.consent.statistics.name:Statistiken`,
    enabled: false,
    disabled: false,
    hint: $localize`:@@luxc.consent.statistics.hint:Statistik-Cookies helfen Webseiten-Besitzern zu verstehen, wie Besucher mit Webseiten interagieren, indem Informationen anonym gesammelt und gemeldet werden.`
  },
  {
    purpose: LuxConsentPurpose.Marketing,
    name: $localize`:@@luxc.consent.marketing.name:Marketing`,
    enabled: false,
    disabled: false,
    hint: $localize`:@@luxc.consent.marketing.hint:Marketing-Cookies werden verwendet, um Besuchern auf Webseiten zu folgen. Die Absicht ist, Anzeigen zu zeigen, die relevant und ansprechend für den einzelnen Benutzer sind und daher wertvoller für Publisher und werbetreibende Drittparteien sind.`
  },
  {
    purpose: LuxConsentPurpose.Other,
    name: $localize`:@@luxc.consent.other.name:Nicht klassifiziert`,
    enabled: false,
    disabled: false,
    hint: $localize`:@@luxc.consent.other.hint:Nicht klassifizierte Cookies sind Cookies, die wir gerade versuchen zu klassifizieren, zusammen mit Anbietern von individuellen Cookies.`
  }
];

export default LUX_CONSENT_CATEGORIES;
