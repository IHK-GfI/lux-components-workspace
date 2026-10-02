# Prompt für v23: Legacy-Form-Mechanismus entgültig entfernen

Dieser Prompt ist als Einstieg für eine zukünftige Arbeitssitzung (Issue) zur
v23-Migration gedacht. Er baut auf Issue #289 (v22, Umstellung aller
FormControls auf Angular Signal Forms) auf und wurde anhand des Codestands
vom 2026-09-14 auf Branch `Issue_289-components-signals_onpush` erstellt.

## Kontext

In Issue #289 (v22) wurden alle 17 lux-components-lib-FormControls auf den
Angular-Signal-Forms-Vertrag (`FormValueControl<T>`/`FormCheckboxControl` aus
`@angular/forms/signals`) umgestellt. Aus Kompatibilitätsgründen wurde dabei
eine Übergangs-Bridge beibehalten, die alte Reactive-Forms-Bindung
(`luxFormGroup`/`luxControlBinding`/`luxFormControl`) und die alten
Zwei-Wege-Bindungen `luxValue`/`luxChecked`/`luxSelected` weiterhin
funktionsfähig hält. Alle beteiligten Klassen tragen bereits den Hinweis
`@deprecated Übergangslösung, entfällt mit der nächsten Major-Version.`
Diese Aufgabe löst dieses Versprechen für v23 ein: die Bridge und alle
Alt-APIs werden vollständig entfernt.

## Betroffener Code (Stand v22, verifiziert per grep)

### 1. Zu entfernender Ordner

`projects/lux-components-lib/src/lib/lux-form/lux-form-model/lux-form-legacy/`

- `lux-legacy-form-bridge.ts` (`LuxLegacyFormBridge`, `LuxLegacyBridgeHost`)
- `lux-form-legacy-value-base.class.ts` (`LuxFormLegacyValueBase`)
- `lux-form-legacy-checkable-base.class.ts` (`LuxFormLegacyCheckableBase`)
- `lux-form-legacy-selectable-base.class.ts` (`LuxFormLegacySelectableBase`)
- `lux-control-value-accessor.directive.ts` **NICHT** automatisch mit
  entfernen, siehe "Bewusst ausgeklammert" unten.

### 2. Konkrete Controls: Umhängen auf die neuen Basisklassen

| Bisherige Legacy-Basis        | Neue Basis                                                                                         | Betroffene Controls                                                                                                                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LuxFormLegacyValueBase`      | `LuxFormValueControlBase<T>` (`lux-form-model/lux-form-value-control-base.class.ts`)               | `lux-autocomplete`, `lux-chips`, `lux-datepicker`, `lux-datetimepicker`, `lux-input`, `lux-slider`, `lux-textarea`, `lux-timepicker`, `lux-lookup-model/lux-lookup-component.ts` (Basis für `lux-lookup-autocomplete`, `lux-lookup-combobox`) |
| `LuxFormLegacyCheckableBase`  | `LuxFormCheckboxControlBase` (`lux-form-model/lux-form-checkbox-control-base.class.ts`)            | `lux-checkbox`, `lux-toggle`                                                                                                                                                                                                                  |
| `LuxFormLegacySelectableBase` | `LuxFormSelectableControlBase<O,V,P>` (`lux-form-model/lux-form-selectable-control-base.class.ts`) | `lux-radio`, `lux-select`                                                                                                                                                                                                                     |

`lux-form-file-base.class.ts` (Basis für `lux-file-input`, `lux-file-list`,
`lux-file-upload`) implementiert `LuxLegacyBridgeHost<T>` zusätzlich zu
`LuxFormValueControlBase<T>` — dieses Interface und die zugehörige
`bridge`-Instanz entfallen, die Klasse extended weiterhin
`LuxFormValueControlBase<T>` direkt. 

### 3. Aus allen betroffenen Komponenten zu entfernen

- Inputs `luxControlBinding`, `luxFormGroup`, `luxFormControl`,
  `luxControlValidators`
- Zwei-Wege-Bindungen `luxValue`/`luxValueChange`, `luxChecked`/
  `luxCheckedChange`, `luxSelected`/`luxSelectedChange`
- ggf. nun ungenutzte `ReactiveFormsModule`-Imports in den Komponenten
- Property-Getter `inForm`/`formGroup`/`formControl`/`modelValue`/
  `valueInput`, die nur die Bridge ansprechen

## Bewusst ausgeklammert

`LuxControlValueAccessorDirective` / `LUX_FORMS_COMPAT`
(`lux-form-legacy/lux-control-value-accessor.directive.ts`) ist **kein**
Teil der alten `luxFormGroup`/`luxControlBinding`-Bridge, sondern ein
neuerer, schlanker `ControlValueAccessor`-Adapter für klassische Reactive
Forms/ngModel mit den neuen Signal-Forms-Komponenten. Er trägt keinen
"entfällt mit der nächsten Major-Version"-Hinweis, sondern verweist in
seinem eigenen Docstring auf Angulars offizielles
`compatForm()`/`SignalFormControl` aus `@angular/forms/signals/compat` als
langfristigen Ersatz. Ob und wann dieser Adapter entfällt, ist eine eigene
Entscheidung — bitte **nicht** im Rahmen dieser Aufgabe mit entfernen, nur
nennen, falls es beim Aufräumen auffällt.

## Vorgehen

Pro Control-Familie, analog zur Migrationsmethodik aus Issue #289, nur in
umgekehrter Richtung:

1. Komponente auf die neue Basisklasse umhängen, Legacy-Inputs/Outputs
   entfernen, verwaiste Bridge-Getter entfernen.
2. Zugehörige `.spec.ts`-Datei bearbeiten: anders als in Issue #289 gilt
   hier **nicht** mehr "Spec nie anfassen" — im Gegenteil, alle Testfälle,
   die `luxFormGroup`/`luxControlBinding`/`[formGroup]`/`[formControl]`/
   `luxValue`/`luxChecked`/`luxSelected` exerzieren, sind jetzt zu entfernen
   oder auf die neue API (`formField`/`[(value)]`/`[(checked)]`)
   umzuschreiben, da sie sonst nicht mehr kompilieren. Bereits jetzt per
   grep gefundene betroffene Specs (Liste ist eine Starthilfe, nicht
   abschliessend zu verstehen): `lux-button-toggle`, `lux-filter-form`,
   `lux-autocomplete`, `lux-checkbox`, `lux-chips`, `lux-datepicker`,
   `lux-datetimepicker`, `lux-file-input`, `lux-file-list`,
   `lux-form-model/lux-control-disable`, `lux-input`,
   `lux-input-binding-modes`, `lux-radio`, `lux-select`, `lux-slider`,
   `lux-textarea`, `lux-timepicker`, `lux-toggle`, `lux-stepper`,
   `lux-lookup-combobox`.
3. Volle Testsuite + `npm run pack:components` (Lib-Build) + demo-app-Build
   + `ng lint` für beide Projekte laufen lassen, erst danach zur nächsten
   Control-Familie weitergehen.
4. Demo-App aufräumen: in allen Beispiel-Komponenten unter
   `projects/demo-app/src/app/components-overview/` die "Reactive-Form"-
   Beispielblöcke (`[formGroup]`/`[formControl]`/`luxControlBinding`, ca. 35
   Fundstellen) sowie alle als "@deprecated"/"Freistehend — `[(luxValue)]`"
   markierten Beispielblöcke entfernen. Übrig bleiben je Control die
   Signal-Form- und die "Freistehend — `[(value)]`"-Beispiele.
5. Optional, aber empfohlen: Migrations-Schematic unter
   `projects/lux-components-update/src/updates/23.0.0/` ergänzen (Vorbild:
   die bestehenden 19.x/21.x-Schematics), die in Consumer-Templates
   mindestens `[(luxValue)]`/`[(luxChecked)]`/`[(luxSelected)]`
   automatisiert auf `[(value)]`/`[(checked)]` umschreibt und bei
   gefundenem `luxFormGroup`/`luxControlBinding` eine manuelle
   Migrationswarnung ausgibt (kein automatisches Refactoring auf
   `[formField]` möglich, da das eine strukturelle Formular-Definition
   voraussetzt).
6. CHANGELOG und Wiki aktualisieren (`projects/lux-components-wiki/Versions/`
   als Vorbild, neuer `Versions/v23/`-Eintrag mit Breaking-Changes-Liste und
   Migrationsanleitung je Control).

## Abnahmekriterien

- `lux-form-legacy/`-Ordner ist bis auf
  `lux-control-value-accessor.directive.ts` gelöscht, keine Referenzen mehr
  auf `LuxLegacyFormBridge`/`LuxFormLegacy*Base`/`LuxLegacyBridgeHost` im
  Repo.
- Keine der vier Legacy-Inputs (`luxControlBinding`/`luxFormGroup`/
  `luxFormControl`/`luxControlValidators`) und keine der drei Alt-Bindungen
  (`luxValue`/`luxChecked`/`luxSelected`) existieren mehr auf irgendeinem
  Control.
- Volle Testsuite, Lib-Build, Demo-Build und Lint (beide Projekte) grün.
- CHANGELOG/Wiki dokumentieren die Breaking Changes mit
  Vorher-/Nachher-Beispiel je betroffenem Control.

## Hinweise für die Umsetzung

1. **Die "Spec nie anfassen"-Regel dreht sich um.** In #289 galt sie, weil
   die Specs die Kompatibilitätsgrenze definierten. In v23 ist das Gegenteil
   der Fall — Specs, die die Legacy-API testen, müssen jetzt
   angepasst/entfernt werden, sonst kompiliert nichts mehr.
2. Der `LuxControlValueAccessorDirective`-Adapter ist bewusst aus dem Scope
   rausgehalten, weil er im Code selbst nicht mit "entfällt mit der
   nächsten Major-Version" markiert ist, sondern auf Angulars eigenes
   `compatForm()` als langfristigen Ersatz verweist — das ist eine andere
   Entscheidung als die hier gemeinte.
