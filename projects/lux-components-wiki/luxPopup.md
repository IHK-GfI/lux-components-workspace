# luxPopup

Die neue Popup-Komponente kombiniert die bekannten Tooltip-Interaktionen mit einem optionalen, persistenten Popover-Verhalten. Sie eignet sich für kurze Hilfetexte (nicht persistent) sowie für reichhaltige Inhalte inkl. Buttons oder Links (persistent).

## Grundidee

- **Nicht persistent** (`luxPersistent = false` – Standard):
  - Wird per Hover, Tastaturfokus oder Long-Press angezeigt.
  - Schließt automatisch bei Mausverlassen, Fokusverlust, Escape oder Klick außerhalb.
  - Bleibt rein informativ, der Fokus verbleibt auf dem Trigger.
- **Persistent** (`luxPersistent = true`):
  - Wird aktiv (z.B. per Klick) geöffnet und bleibt sichtbar, bis der Nutzer eine Aktion ausführt, Escape drückt oder außerhalb klickt.
  - Erlaubt den Fokus innerhalb des Popups z.B. für Buttons oder Links.
  - Kein Fokus-Trapping und kein modaler Charakter.

## Verwendung

```html
<div
  [luxPopupTriggerFor]="contextPopup"
  [luxPopupShowDelay]="500"
  [luxPopupHideDelay]="150"
  [luxPopupPosition]="'above'"
>
  Hilfetext anzeigen
</div>

<lux-popup #contextPopup [luxTitle]="'Hinweis'" [luxMinWidth]="240" [luxMaxWidth]="360">
  <p>Erklärender Text für das aktuelle UI-Element.</p>
</lux-popup>

<lux-button
  luxLabel="Mehr erfahren"
  [luxPopupTriggerFor]="actionPopup"
  [luxPopupPosition]="'after'"
>
</lux-button>

<lux-popup #actionPopup [luxPersistent]="true" [luxTitle]="'Aktionen'">
  <p>Persistente Popups erlauben Interaktionen wie Bestätigungen oder weiterführende Links.</p>
  <ng-template luxPopupActions>
    <lux-button luxColor="primary" luxLabel="Verstanden"></lux-button>
    <lux-link luxLabel="Mehr erfahren"></lux-link>
  </ng-template>
</lux-popup>
```

## Trigger-Direktive

| Property              | Typ                    | Standard | Beschreibung |
|----------------------|------------------------|----------|--------------|
| `luxPopupTriggerFor` | `LuxPopupComponent`    | –        | Verknüpft das Auslöse-Element mit einem konkreten Popup. |
| `luxPopupPosition`   | `LuxPopupPosition`     | `above`  | Bevorzugte Positionierung relativ zum Trigger. |
| `luxPopupShowDelay`  | `number` (ms)          | `500`    | Verzögerung bis das Popup im transienten Modus gezeigt wird. |
| `luxPopupHideDelay`  | `number` (ms)          | `100`    | Verzögerung bis zur automatischen Schließung (transient). |
| `luxPopupDisabled`   | `boolean`              | `false`  | Unterbindet sämtliche Interaktionen mit dem Popup. |

## `lux-popup` Component API

| Property          | Typ        | Standard | Beschreibung |
|-------------------|------------|----------|--------------|
| `luxTitle`        | `string`   | –        | Optionaler Titel, wird nur gerendert, wenn gesetzt. |
| `luxPersistent`   | `boolean`  | `false`  | Steuert das Dialog-ähnliche Verhalten. |
| `luxMinWidth`     | `number`   | `220`    | Minimale Breite des Overlays in Pixeln. |
| `luxMaxWidth`     | `number`   | `360`    | Maximale Breite des Overlays (wird automatisch ≥ `luxMinWidth` gehalten). |
| `luxAriaLabel`    | `string`   | –        | Optionales, explizites ARIA-Label. |

| Event        | Payload                | Beschreibung |
|--------------|------------------------|--------------|
| `luxOpened`  | `void`                 | Wird ausgelöst, sobald das Overlay sichtbar ist. |
| `luxClosed`  | `LuxPopupCloseReason`  | Liefert den Grund des Schließens (z.B. `outside`, `escape`, `pointer-leave`, `toggle`). |

Zusätzliche Inhalte wie Buttons können per `luxPopupActions`-Template in den Footer eingeblendet werden. Dieser Bereich erscheint nur, wenn das Template vorhanden ist.

## Accessibility

- Nicht-persistente Varianten nutzen `role="tooltip"` und `aria-live="polite"`, behalten den Fokus auf dem Trigger und respektieren Escape.
- Persistente Popups verwenden `role="dialog"`, erlauben Fokuswechsel innerhalb des Overlays und bleiben weiterhin nicht-modal (`aria-modal="false"`).
- `aria-haspopup`/`aria-expanded` werden automatisch vom Trigger gepflegt.

## Best Practices

1. Verwende den transienten Modus für kurze Hinweise (1–2 Sätze).
2. Nutze den persistenten Modus für interaktive Inhalte (Buttons, Links, Checkboxen), aber halte die Fläche kompakt.
3. Lege sinnvolle Verzögerungen für Hover/Blur fest, um unbeabsichtigtes Blinken zu vermeiden (z.B. 500 ms / 120 ms).
4. Stelle sicher, dass die Inhalte barrierefrei formuliert sind und die Aktionen auch ohne Maus erreichbar bleiben.
