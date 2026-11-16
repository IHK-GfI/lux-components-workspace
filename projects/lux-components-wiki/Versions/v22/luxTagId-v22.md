# luxTagId

- [luxTagId](#luxtagid)
  - [Direktive LuxTagIdDirective und LuxCustomTagIdDirective](#direktive-luxtagiddirective-und-luxcustomtagiddirective)
    - [Generierte LUX-Tag-Id](#generierte-lux-tag-id)
    - [Manuell gesetzte LUX-Tag-Id für eine LUX-Component](#manuell-gesetzte-lux-tag-id-für-eine-lux-component)
    - [Manuell gesetzte LUX-Tag-Id für ein beliebiges Element](#manuell-gesetzte-lux-tag-id-für-ein-beliebiges-element)
  - [Konfiguration](#konfiguration)
    - [Direkte Konfiguration](#direkte-konfiguration)
    - [Konfiguration über die Umgebung](#konfiguration-über-die-umgebung)

Jede LUX-Component (z.B. lux-input, lux-checkbox,...) kann über eine LUX-Tag-Id (Attribut `data-luxtagid`) verfügen.
Die LUX-Tag-Ids sollen es den automatischen Tests ermöglichen, im Test die LUX-Components zuverlässig zu identifizieren.
Über das Flag `generateLuxTagIds` in der Konfiguration (siehe [Config](config-v22#luxcomponentsconfigparameters))
wird gesteuert, ob die LUX-Tag-Ids ausgegeben werden. Es kann sinnvoll sein, die LUX-Tag-Ids ausschließlich für
Testumgebungen zu aktivieren.

## Direktive LuxTagIdDirective und LuxCustomTagIdDirective

Damit nicht alle Entwickler zwanghaft allen LUX-Components eine LUX-Tag-Id setzen müssen, wurde die Direktive
`LuxTagIdDirective` und `LuxCustomTagIdDirective` eingeführt. Die `LuxTagIdDirective`-Directive versucht, die LUX-Tag-Ids automatisch zu generieren. Um eine
Eindeutigkeit zu gewährleisten, sammelt die Direktive die LUX-Tag-Ids der Eltern ein und konkateniert diese z.B. mit
dem Label oder Controlbinding. Wenn die Direktive einmal nicht in der Lage ist, eine LUX-Tag-Id zu generieren,
wird eine Warnung in der Konsole ausgegeben. In diesen Fällen muss der Entwickler die LUX-Tag-Id manuell (z.B.
über das Attribut `luxTagId` oder mit der `LuxCustomTagIdDirective`-Directive) angeben.

### Generierte LUX-Tag-Id

Die LUX-Tag-Ids (Attribut `data-luxtagid`) werden nur ausgegeben,
wenn das Flag `generateLuxTagIds` in der Konfiguration (siehe [Config](config-v22#luxcomponentsconfigparameters))
aktiviert ist.

Html-Template:

```html
<lux-card luxTitle="Person">
  <lux-card-content>
    <lux-input luxLabel="Vorname" />
  </lux-card-content>
</lux-card>
```

HTML-Ausgabe:

```html
<lux-card luxTitle="Person" data-luxtagid="lux-card#person">
  <lux-card-content>
    <lux-input luxLabel="Vorname" data-luxtagid="lux-card#person.vorname">...</lux-input>
  </lux-card-content>
</lux-card>
```

### Manuell gesetzte LUX-Tag-Id für eine LUX-Component

Auch die manuell gesetzten LUX-Tag-Ids (Attribut `data-luxtagid`) werden nur angezeigt,
wenn das Flag `generateLuxTagIds` in der Konfiguration (siehe [Config](config-v22#luxcomponentsconfigparameters))
aktiviert ist.

Html-Template

```html
<lux-card luxTitle="Person">
  <lux-card-content>
    <lux-input luxLabel="Vorname" luxTagId="firstname" />
  </lux-card-content>
</lux-card>
```

HTML-Ausgabe:

```html
<lux-card luxTitle="Person" data-luxtagid="lux-card#person">
  <lux-card-content>
    <lux-input luxLabel="Vorname" data-luxtagid="lux-card#person.firstname" />
  </lux-card-content>
</lux-card>
```

### Manuell gesetzte LUX-Tag-Id für ein beliebiges Element

Html-Template:

```html
<lux-card luxTitle="Person" luxCustomTagId="my-id" luxCustomTagIdSelector="mat-card">
  ...
</lux-card>
```

HTML-Ausgabe:

```html
<lux-card luxTitle="Person">
  ...
  <mat-card data-luxtagid="my-id">
    ...
  </mat-card>
</lux-card>
```

Anmerkung: Das Attribut `luxCustomTagIdSelector` muss nicht angegeben werden. Wenn das Attribut fehlt, wird das Element verwendet, an dem es definiert wurde.

## Konfiguration

### Direkte Konfiguration

In der LUX-Componentskonfiguration wird das Flag `generateLuxTagIds` direkt auf `true` oder `false` gesetzt.

Datei `app.config.ts`:

```typescript
const myConfiguration: LuxComponentsConfigParameters = {
  generateLuxTagIds: true,
  ...
};

export const appConfig: ApplicationConfig = {
  providers: [provideLuxComponentsConfig(myConfiguration)]
};
```

### Konfiguration über die Umgebung

In der LUX-Componentskonfiguration wird das gleichnamige Flag `generateLuxTagIds` aus der
Umgebung (Ordner `src/environments`) referenziert. Beim Bauen mit `--configuration production` wird über
die `fileReplacements` in der `angular.json` die Datei `environment.prod.ts` verwendet, andernfalls die Datei `environment.ts`.

Datei `app.config.ts`:

```typescript
const myConfiguration: LuxComponentsConfigParameters = {
  generateLuxTagIds: environment.generateLuxTagIds,
  displayLuxConsoleLogs: true,
};
```

Datei `environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  generateLuxTagIds: false,
};
```

Datei `environment.ts`:

```typescript
export const environment = {
  production: false,
  generateLuxTagIds: true,
};
```
