# Component Status Markers

Dieses Marker-System ist rein demo-app-intern. Es ist kein Bestandteil des LUX-Design-Systems und bekommt deshalb keine eigene Example-Seite in der Demo.

## Zweck

- `new` kennzeichnet eine neu hinzugekommene Demo-Komponente.
- `updated` kennzeichnet eine bestehende Demo-Komponente, deren Beispiel um neue fachliche Optionen oder neues Verhalten erweitert wurde.

Der sichtbare Text in der Demo lautet:

- `new` -> `neu`
- `updated` -> `aktualisiert`

## Pflegeorte

- Die Statuszuordnung pro Beispielkomponente wird zentral in `projects/demo-app/src/app/components-overview/components-overview-navigation.service.ts` gepflegt.
- Die Marker-Definition selbst liegt in `projects/demo-app/src/app/base/status-marker/`.

## Pflegeregeln

- Massgeblich ist die letzte fachlich relevante Aenderung an einer Demo-Komponente.
- Reine Doku- oder Link-Korrekturen erzeugen keinen neuen Markerstatus.
- Wenn eine neue Komponente spaeter nur erweitert wird, kann ihr Status von `new` auf `updated` wechseln.

## Wann ein Inline-Marker im Example gesetzt wird

- Ein Inline-Marker wird nur dort gesetzt, wo die neue oder geaenderte Option im Beispiel direkt sichtbar gemacht werden soll.
- Die Navigation und die Komponentenuebersicht bleiben die zentrale Quelle fuer den Komponentenstatus.
- Bei bestehenden Komponenten mit Status `updated` werden neu hinzugekommene API-Optionen im Example nach Moeglichkeit mit einem zusaetzlichen `neu`-Marker direkt am betroffenen Control markiert.
- Aeltere, bereits vorhandene Inline-Marker koennen voruebergehend bestehen bleiben, auch wenn sie nicht Teil der aktuellen Release-Kandidaten sind.
