# luxTagId

Jede LUX-Component (z.B. lux-input, lux-checkbox,...) kann über eine LUX-Tag-Id (Attribut `data-luxtagid`) verfügen.
Die LUX-Tag-Ids sollen es den automatischen Tests ermöglichen, im Test die LUX-Components zuverlässig zu identifizieren.
Über das Flag `generateLuxTagIds` in der Konfiguration (siehe [Config](config-v14#luxcomponentsconfigparameters))
wird gesteuert, ob die LUX-Tag-Ids ausgegeben werden. Es kann sinnvoll sein, die LUX-Tag-Ids ausschließlich für
Testumgebungen zu aktivieren.

## Direktive LuxTagIdDirective

Damit nicht alle Entwickler zwanghaft allen LUX-Components eine LUX-Tag-Id setzen müssen, wurde die Direktive
`LuxTagIdDirective` eingeführt. Diese Direktive versucht, die LUX-Tag-Ids automatisch zu generieren. Um eine
Eindeutigkeit zu gewährleisten, sammelt die Direktive die LUX-Tag-Ids der Eltern ein und konkateniert diese z.B. mit
dem Label oder Controlbinding. Wenn die Direktive einmal nicht in der Lage ist, eine LUX-Tag-Id zu generieren,
wird eine Warnung in der Console ausgegeben. In diesen Fällen muss der Entwickler die LUX-Tag-Id manuell (z.B
über das Attribut `luxTagId`) angeben.

### Generierte LUX-Tag-Id

Html

```html
<lux-card luxTitle="Person">
  <lux-card-content>
    <lux-input luxLabel="Vorname">... </lux-input>
  </lux-card-content>
</lux-card>
```

HTML-Ausgabe nach dem Ausführen der Direktive `LuxTagIdDirective`:

```html
<lux-card luxTitle="Person" data-luxtagid="lux-card#person">
  <lux-card-content>
    <lux-input luxLabel="Vorname" data-luxtagid="lux-card#person.vorname"
      >...
    </lux-input>
  </lux-card-content>
</lux-card>
```

### Manuell gesetzte LUX-Tag-Id

Html

```html
<lux-card luxTitle="Person">
  <lux-card-content>
    <lux-input luxLabel="Vorname" luxTagId="firstname">... </lux-input>
  </lux-card-content>
</lux-card>
```

HTML-Ausgabe nach dem Ausführen der Direktive `LuxTagIdDirective`:

```html
<lux-card luxTitle="Person" data-luxtagid="lux-card#person">
  <lux-card-content>
    <lux-input luxLabel="Vorname" data-luxtagid="lux-card#person.firstname"
      >...
    </lux-input>
  </lux-card-content>
</lux-card>
```

## Konfiguration

### Direkte Konfiguration

In der LUX-Componentskonfiguration wird das Flag `generateLuxTagIds` direkt auf `true` oder `false` gesetzt.

Datei `app.module.ts`:

```typescript
const myConfiguration: LuxComponentsConfigParameters = {
  generateLuxTagIds: true,
  ...
};
```

### Konfiguration über die Umgebung

In der LUX-Componentskonfiguration wird das gleichnamige Flag `generateLuxTagIds` aus der
Umgebung (Ordner `src/environments`) referenziert. D.h. wenn beim Bauen das Flag `--prod`
(siehe Skripte in der Datei `package.json`) verwendet wird, dann wird die Datei `environment.prod.ts` gezogen,
andernfalls die Datei `environment.ts`.

Datei `app.module.ts`:

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
  production: true,
  generateLuxTagIds: true,
};
```
