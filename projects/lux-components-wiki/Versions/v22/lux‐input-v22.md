# LUX-Input

![Beispielbild LUX-Input](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐input-v22-img.png)

- [LUX-Input](#lux-input)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Ohne Formular](#2-ohne-formular)
    - [3. Mit Suffix und Präfix](#3-mit-suffix-und-präfix)
    - [4. Mit Formular](#4-mit-formular)
    - [5. Komplexe Validierung mit Pattern](#5-komplexe-validierung-mit-pattern)

## Overview / API

### Allgemein

| Name     | Beschreibung            |
| -------- | ----------------------- |
| selector | lux-input, lux-input-ac |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxName                | string                 | Der Name des Elements                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| luxType                | string                 | Gibt den Typ (z.B. text, number, password, email,...) an. Default: 'text'.                                                                                                                                                                                                                                                                                                                                                                                                          |
| luxMaxLength           | number                 | Gibt an, wie viele Zeichen erlaubt sind (0 = unbegrenzt). Vorsicht! Das funktioniert nicht für den Type "number". <br><br> Es wird ein Label angezeigt, das angibt, wie viele Zeichen (z.B. 10/50) noch eingegeben werden können. Über die Eigenschaft `luxHideCounterLabel` kann das Verhalten gesteuert werden. Bedingungen: luxType = `text` und das Element hat den Fokus. Default: 0.                                                                                          |
| luxNumberAlignLeft     | boolean                | Gibt an, ob Zahlen linksbündig dargestellt werden. Default: false.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| formField              | FieldTree\<T\>         | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                                                                                                                                                                         |
| value                  | string                 | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                                                                                                                                                                                                                                     |
| luxValue               | string                 | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Der Text-Wert des Input-Felds. Two-Way-Binding ebenfalls möglich, wenn das Input-Feld nicht innerhalb eines Reactive-Forms ist.                                                                                                                                                                                                                                                                                 |
| luxHideCounterLabel    | boolean                | Blendet das Zähler-Label aus (siehe Eigenschaft `luxMaxLength`). Default: false.                                                                                                                                                                                                                                                                                                                                                                                                    |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                                                                                                                       |
| luxClearable           | boolean                | Blendet optional einen Button im Eingabefeld ein, mit dem der aktuelle Eingabewert zurückgesetzt werden kann. Default: false.                                                                                                                                                                                                                                                                                                                                                       |
| luxClearAriaLabel      | string                 | ARIA-Label für den Zurücksetzen-Button. Wenn leer, wird ein Standardtext verwendet.                                                                                                                                                                                                                                                                                                                                                                                                 |
| luxPlaceholder         | string                 | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird. Default: ''.                                                                                                                                                                                                                                                                                                                                                                                 |
| luxAutocomplete        | string                 | Steuert, ob der Browser den Inhalt cachen darf. Default: 'on'.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| luxRequired            | boolean                | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                                                                                                                                                             |
| luxControlBinding      | string                 | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                                                                                                     |
| luxErrorMessage        | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                                                                                                                                      |
| luxDisabled            | boolean                | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                                                                                                                                                                              |
| luxReadonly            | boolean                | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                                                                                                                                                                    |
| luxErrorCallback       | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                                                                                                                          |
| luxControlValidators   | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen. Für eine strengere E-Mail-Validierung kann z.B. `LuxValidators.email` verwendet werden (nur für Reactive Forms bzw. luxControlValidators; in Signal Forms wird die `email()`-Regel von Angular verwendet, siehe Beispiel 1). |
| luxLabel               | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                                                         |
| luxHint                | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                                                                                                                                            |
| luxHintShowOnlyOnFocus | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                                                                                                                                         |
| luxLabelLongFormat     | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                                                                                                                                                           |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| luxNoTopLabel          | boolean                | Gibt an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                                                                                                                                                    |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                                                                                                                                               |
| luxId                  | string                 | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                                                                                                                                                                             |
| luxAriaLabel           | string                 | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                                                                                                                                                                                     |
| luxAriaLabelledby      | string                 | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                                                                                                                                                                           |
| luxFormGroup           | FormGroup              | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                                                                                                                                                               |
| luxFormControl         | FormControl            | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                                                                                                                                                                  |

### @Output

| Name              | Typ        | Beschreibung                                                                                                                                                                                                                                                                                       |
| ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValueChange    | string     | Gehört zur veralteten `luxValue`-API, stattdessen `(valueChange)` verwenden. Output-Event das bei Änderungen am Value-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxValue.                                                                                                           |
| luxBlur           | FocusEvent | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusOut (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus verliert und Kindelemente nicht betrachtet werden. |
| luxFocus          | FocusEvent | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusIn (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus erhält und Kindelemente nicht betrachtet werden.     |
| luxFocusIn        | FocusEvent | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                           |
| luxFocusOut       | FocusEvent | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                          |
| luxDisabledChange | boolean    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                                                                                                                           |
| valueChange       | string     | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                                                                                                                                                                             |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, email, form, required } from '@angular/forms/signals';

readonly person = signal({ firstname: '', email: '' });
readonly personForm = form(this.person, (path) => {
  required(path.firstname, { message: 'Bitte geben Sie Ihren Vornamen ein.' });
  required(path.email);
  email(path.email, { message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
});
```

Html

```html
<lux-input luxLabel="Vorname" [formField]="personForm.firstname" />
<lux-input luxLabel="E-Mail" luxType="email" [formField]="personForm.email" />
```

### 2. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐input-v22-img-01.png)

Ts

```typescript
readonly firstname = signal('');
```

Html

```html
<lux-input
  luxAutofocus
  luxLabel="Vorname"
  [(value)]="firstname"
  luxHint="Bitte geben Sie Ihren Vornamen ein"
/>
```

### 3. Mit Suffix und Präfix

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐input-v22-img-02.png)

Html

```html
<lux-input luxLabel="Vorname" luxAutofocus>
  <lux-input-prefix><lux-icon luxIconName="lux-cogs" />&nbsp;</lux-input-prefix>
  <lux-input-suffix>&nbsp;<lux-icon luxIconName="lux-interface-user-single" /></lux-input-suffix>
</lux-input>
```

### 4. Mit Formular

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐input-v22-img-03.png)

Ts

```typescript
import { LuxValidators } from '@ihk-gfi/lux-components';

readonly myGroup = new FormGroup({
  user: new FormGroup({
    firstname: new FormControl('', Validators.pattern('[a-zA-Z0-9]*')),
    lastname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
    email: new FormControl('', Validators.compose([Validators.required, LuxValidators.email])),
    password: new FormControl('')
  }),
  description: new FormControl({ value: '', disabled: true }),
  donation: new FormControl('', Validators.compose([Validators.min(0), Validators.max(1000)]))
});
```

Hinweis: `LuxValidators.email` validiert E-Mail-Adressen strenger als `Validators.email` (passend zur serverseitigen JAST-Stack-Prüfung).

Html

```html
<form [formGroup]="myGroup" class="lux-flex lux-flex-col lux-gap-4">
  <div formGroupName="user" class="lux-flex lux-flex-col lux-gap-4">
    <h3>Benutzer</h3>
    <lux-input
      luxAutofocus
      luxLabel="Vorname"
      luxControlBinding="firstname"
    />
    <lux-input
      luxLabel="Nachname"
      luxControlBinding="lastname"
    />
    <lux-input luxLabel="E-Mail" luxControlBinding="email">
      <lux-input-suffix>
        &nbsp;<lux-icon luxIconName="lux-mail-send-envelope" />
      </lux-input-suffix>
    </lux-input>
    <lux-input
      luxLabel="Passwort"
      luxControlBinding="password"
      luxType="password"
    >
      <lux-input-suffix>
        <lux-icon luxIconName="lux-interface-lock" />
      </lux-input-suffix>
    </lux-input>
  </div>
  <lux-input luxLabel="Spende" luxControlBinding="donation" luxType="number">
    <lux-input-prefix>
      <lux-icon luxIconName="lux-money-currency-euro-circle" />&nbsp;
    </lux-input-prefix>
    <lux-input-suffix>.00 EUR</lux-input-suffix>
  </lux-input>
  <lux-input
    luxLabel="Beschreibung"
    luxControlBinding="description"
    luxHint="Ich bin ein Hinweis!"
  />
</form>
```

### 5. Komplexe Validierung mit Pattern

> **Veraltet:** Die Reactive-Forms-Variante (`luxControlBinding`) in diesem Beispiel funktioniert in v22 weiterhin, entfällt aber mit der nächsten Major-Version. Für neue Formulare bitte Signal Forms verwenden (siehe [1. Signal Forms](#1-signal-forms)).

![Beispielbild 04-01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐input-v22-img-04-01.png)

![Beispielbild 04-02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐input-v22-img-04-02.png)

Dieses Beispiel zeigt, wie man Validatoren kombinieren kann,
um komplexere Prüfungen umzusetzen. Zusätzlich wird über
einen individuellen ErrorCallback die Fehlermeldung bei Pattern-Verstößen
überschrieben.

Ts - Mit Formular

```typescript
readonly myGroup = new FormGroup({
  knr: new FormControl('', Validators.compose([Validators.pattern(/^[\d]{1,3}$/), Validators.minLength(3), Validators.maxLength(3), Validators.min(100), Validators.max(199)]))
});

readonly errorCallback = (value: any, errors: LuxValidationErrors) => {
  // Hier wird nur die Fehlermeldung für das Muster überschrieben.
  // Für alle anderen Fehler soll die Standardfehlermeldung
  // verwendet werden (return undefined).
  if (errors['pattern']) {
    return 'Bitte geben Sie eine 3-stellige Kammernummer (z.B. 189) ein';
  }

  return undefined;
};
```

Html - Mit Formular

```html
<form [formGroup]="myGroup">
  <lux-input
    luxAutofocus
    luxLabel="Knr"
    luxControlBinding="knr"
    [luxErrorCallback]="errorCallback"
    [luxMaxLength]="3"
  />
</form>
```

Ts - Ohne Formular

```typescript
readonly knr = signal('');

readonly validatorFnArr = [Validators.pattern(/^[\d]{1,3}$/), Validators.minLength(3), Validators.maxLength(3), Validators.min(100), Validators.max(199)];

readonly errorCallback = (value: any, errors: LuxValidationErrors) => {
  // Hier wurde nur die Fehlermeldung für das Muster überschrieben.
  if (errors['pattern']) {
    return 'Bitte geben Sie eine 3-stellige Kammernummer (z.B. 189) ein';
  }

  // undefined bedeutet, dass die Standardfehlermeldung verwendet werden soll.
  return undefined;
};
```

Html - Ohne Formular

```html
<lux-input
  luxAutofocus
  luxLabel="Knr"
  luxName="knr"
  [(value)]="knr"
  [luxControlValidators]="validatorFnArr"
  [luxMaxLength]="3"
  [luxErrorCallback]="errorCallback"
/>
```
