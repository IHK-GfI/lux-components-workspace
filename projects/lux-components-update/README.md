# LUX-Components-Update

Dieses Projekt enthält alle Updateskripte (umgesetzt mit Angular Schematics) für die LUX-Components.

Updateskripte:

- `update-19.x.x` (aktualisiert das Projekt auf die Version 19.x.x)
- `add-lux-components` (fügt die LUX-Components zu einem Angular-Projekt hinzu)

## Voraussetzungen

Stellen Sie zunächst sicher, dass Sie die Angular-Schematics-Cli installiert haben:

```bash
npm install -g @angular-devkit/schematics-cli
```

## LUX-Components im Projekt aktualisieren

Um ein Updateskript zu starten, kann der folgende Befehl verwendet werden:

```bash
ng generate @ihk-gfi/lux-components-update:update-19.x.x
```

Falls erst einmal ein Testdurchlauf ohne persistente Änderungen gewünscht ist,
ist es möglich den Aufruf mit dem Flag "--dry-run" zu versehen:

```bash
ng generate @ihk-gfi/lux-components-update:update-19.x.x --dry-run
```

## LUX-Components im Projekt einrichten

Wenn man die LUX-Components in seinem Projekt einrichten möchte, kann der folgende Befehl verwendet werden:

```bash
ng generate @ihk-gfi/lux-components-update:add-lux-components
```
