# LUX-Input

![Beispielbild LUX-Input](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐input-v18-img.png)

- [LUX-Input](#lux-input)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Ohne Formular](#1-ohne-formular)
    - [2. Mit Suffix und Präfix](#2-mit-suffix-und-präfix)
    - [3. Mit Formular](#3-mit-formular)
    - [4. Komplexe Validierung mit Pattern](#4-komplexe-validierung-mit-pattern)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| import   | LuxFormModule |
| selector | lux-input-ac  |

### @Input

| Name                   | Typ                    | Beschreibung                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxName                | string                 | Der Name des Elements                                                                                                                                                                                                                                                                                                                                                        |
| luxType                | string                 | Gibt den Typ (z.B. text, number, password, email,...) an.                                                                                                                                                                                                                                                                                                                    |
| luxMaxLength           | number                 | Gibt an, wie viele Zeichen erlaubt sind. Vorsicht! Das funktioniert nicht für den Type "number". <br><br> Ab Version 11.5.0 wird ein Label angezeigt, das angibt, wie viele Zeichen (z.B. 10/50) noch eingegeben werden können. Über die Eigenschaft `luxHideCounterLabel` kann das Verhalten gesteuert werden. Bedingungen: luxType = `text` und das Element hat den Fokus. |
| luxNumberAlignLeft     | boolean                | Gibt an, ob Zahlen linksbündig dargestellt werden.                                                                                                                                                                                                                                                                                                                           |
| luxValue               | \<T = string>          | Der Text-Wert des Input-Felds. Two-Way-Binding ebenfalls möglich, wenn das Input-Feld nicht innerhalb eines Reactive-Forms ist.                                                                                                                                                                                                                                              |
| luxHideCounterLabel    | boolean                | Siehe Eigenschaft `luxMaxLength`.                                                                                                                                                                                                                                                                                                                                            |
| luxTagId               | string                 | [LUX-Tag-Id](luxTagId-v18#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                                |
| luxPlaceholder         | string                 | Text der als Platzhalter, solange kein anderer Wert eingetragen ist, dargestellt wird.                                                                                                                                                                                                                                                                                       |
| luxAutocomplete        | string                 | Steuert, ob der Browser den Inhalt cachen darf.                                                                                                                                                                                                                                                                                                                              |
| luxRequired            | boolean                | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                                                                    |
| luxControlBinding      | string                 | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                                                 |
| luxErrorMessage        | string                 | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                               |
| luxDisabled            | boolean                | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                                                                           |
| luxReadonly            | boolean                | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                                                                      |
| luxErrorCallback       | LuxErrorCallbackFnType | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                                   |
| luxControlValidators   | ValidatorFnType        | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                                       |
| luxLabel               | string                 | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt.                                                                                                                                                                                                               |
| luxHint                | string                 | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt. Alternativ kann man über das Content-Child `lux-form-hint` komplexere Hinweise (z.B. mit einem Link) darstellen.                                                                                                                                                                                     |
| luxHintShowOnlyOnFocus | boolean                | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                                  |
| luxLabelLongFormat     | boolean                | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                                                    |
| luxNoLabels            | boolean                | Gibt an, ob Labels angezeigt werden sollen.                                                                                                                                                                                                                                                                                                                                  |
| luxNoTopLabel          | boolean                | Gib an, ob das obere Label angezeigt werden soll.                                                                                                                                                                                                                                                                                                                            |
| luxNoBottomLabel       | boolean                | Gibt an, ob das untere Label (Hinweis oder Fehlermeldung) angezeigt werden soll.                                                                                                                                                                                                                                                                                             |
| luxDense               | boolean                | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                                        |

### @Output

| Name              | Typ                        | Beschreibung                                                                                                                                                                                                                                                                                       |
| ----------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxValueChange    | EventEmitter \<T = string> | Output-Event das bei Änderungen am Value-Feld ausgestoßen wird. Ermöglicht das Two-Way-Binding an luxValue.                                                                                                                                                                                        |
| luxBlur           | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusOut (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus verliert und Kindelemente nicht betrachtet werden. |
| luxFocus          | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt. Unterschied zu luxFocusIn (LUX-FORM-COMPONENT-BASE) ist der, dass dieses Event nur ausgegeben wird wenn das Element selbst den Fokus erhält und Kindelemente nicht betrachtet werden.     |
| luxFocusIn        | EventEmitter \<FocusEvent> | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                           |
| luxFocusOut       | EventEmitter \<FocusEvent> | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                                                                                                                                                                          |
| luxDisabledChange | EventEmitter \<boolean>    | Event welches beim Disablen des Elements ausgelöst wird.                                                                                                                                                                                                                                           |

## Beispiele

### 1. Ohne Formular

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐input-v18-img-01.png)

Ts

```typescript
firstname: string = "";
```

Html

```html
<lux-input-ac
  luxLabel="Vorname"
  [(luxValue)]="firstname"
  luxHint="Bitte geben Sie Ihren Vornamen ein"
></lux-input-ac>
```

### 2. Mit Suffix und Präfix

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐input-v18-img-02.png)

Html

```html
<lux-input-ac luxLabel="Vorname">
  <lux-input-ac-prefix
    ><lux-icon [luxIconName]="'lux-cogs'"></lux-icon>&nbsp;</lux-input-ac-prefix
  >
  <lux-input-ac-suffix
    >&nbsp;<lux-icon [luxIconName]="'lux-interface-user-single'"></lux-icon
  ></lux-input-ac-suffix>
</lux-input-ac>
```

### 3. Mit Formular

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐input-v18-img-03.png)

Ts

```typescript
myGroup: FormGroup;

  constructor() {
    this.myGroup = new FormGroup({
      user: new FormGroup(
        {
          firstname: new FormControl('', Validators.pattern('[a-zA-Z0-9]*')),
          lastname: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
          email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
          password: new FormControl(''),
        }
      ),
      description: new FormControl(''),
      donation: new FormControl('', Validators.compose([Validators.min(0), Validators.max(1000)])),
    });

    this.myGroup.controls['description'].disable();
}
```

Html

```html
<form [formGroup]="myGroup" class="lux-flex lux-flex-col lux-gap-4" #myForm>
  <div formGroupName="user" class="lux-flex lux-flex-col lux-gap-4">
    <h3>Benutzer</h3>
    <lux-input-ac
      luxLabel="Vorname"
      luxControlBinding="firstname"
    ></lux-input-ac>
    <lux-input-ac
      luxLabel="Nachname"
      luxControlBinding="lastname"
    ></lux-input-ac>
    <lux-input-ac luxLabel="E-Mail" luxControlBinding="email">
      <lux-input-ac-suffix>
        &nbsp;<lux-icon luxIconName="lux-mail-send-envelope"></lux-icon>
      </lux-input-ac-suffix>
    </lux-input-ac>
    <lux-input-ac
      luxLabel="Passwort"
      luxControlBinding="password"
      luxType="password"
    >
      <lux-input-ac-suffix>
        <lux-icon luxIconName="lux-interface-lock"></lux-icon>
      </lux-input-ac-suffix>
    </lux-input-ac>
  </div>
  <lux-input-ac luxLabel="Spende" luxControlBinding="donation" luxType="number">
    <lux-input-ac-prefix>
      <lux-icon luxIconName="lux-money-currency-euro-circle"></lux-icon>&nbsp;
    </lux-input-ac-prefix>
    <lux-input-ac-suffix>.00 EUR</lux-input-ac-suffix>
  </lux-input-ac>
  <lux-input-ac
    luxLabel="Beschreibung"
    luxControlBinding="description"
    luxHint="Ich bin ein Hinweis!"
  ></lux-input-ac>
</form>
```

### 4. Komplexe Validierung mit Pattern

![Beispielbild 04-01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐input-v18-img-04-01.png)

![Beispielbild 04-02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐input-v18-img-04-02.png)

Dieses Beispiel zeigt, wie man Validatoren kombinieren kann,
um komplexere Prüfungen umzusetzen. Zusätzlich wird über
einen individuellen ErrorCallback die Fehlermeldung bei Pattern-Verstößen
überschrieben.

Ts - Mit Formular

```typescript
myGroup: FormGroup;

constructor() {
  this.myGroup = new FormGroup({
    knr: new FormControl('', Validators.compose([Validators.pattern(/^[\d]{1,3}$/), Validators.minLength(3), Validators.maxLength(3), Validators.min(100), Validators.max(199)]))
  });
}

errorCallback = (value: any, errors: LuxValidationErrors) => {
  // Hier wird nur die Fehlermeldung für das Muster überschrieben.
  // Für alle anderen Fehler soll die Standardfehlermeldung
  // verwendet werden (return null).
  if (errors.pattern) {
    return 'Bitte geben Sie eine 3-stellige Kammernummer (z.B. 189) ein';
  }

  return undefined;
}
```

Html - Mit Formular

```html
<form [formGroup]="myGroup">
  <lux-input-ac
    luxLabel="Knr"
    luxControlBinding="knr"
    [luxErrorCallback]="errorCallback"
    [luxMaxLength]="3"
  ></lux-input-ac>
</form>
```

Ts - Ohne Formular

```typescript
knr = '';

validatorFnArr = [Validators.pattern(/^[\d]{1,3}$/), Validators.minLength(3), Validators.maxLength(3), Validators.min(100), Validators.max(199)];

constructor() {
}

errorCallback = (value: any, errors: LuxValidationErrors) => {
  // Hier wurde nur die Fehlermeldung für das Muster überschrieben.
  if (errors.pattern) {
    return 'Bitte geben Sie eine 3-stellige Kammernummer (z.B. 189) ein';
  }

  // null bedeutet, dass die Standardfehlermeldung verwendet werden soll.
  return undefined;
}
```

Html - Ohne Formular

```html
<lux-input-ac
  luxLabel="Knr"
  luxName="knr"
  [(luxValue)]="knr"
  [luxControlValidators]="validatorFnArr"
  [luxMaxLength]="3"
  [luxErrorCallback]="errorCallback"
></lux-input-ac>
```
