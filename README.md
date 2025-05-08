# LUX-Components

- [LUX-Components](#lux-components)
  - [Demo](#demo)
  - [Dokumentation](#dokumentation)
  - [Aktualisierung](#aktualisierung)
  - [Autoren](#autoren)
  - [Lizenzhinweis - Icons](#lizenzhinweis---icons)
  - [Lizenzhinweis - Fonts](#lizenzhinweis---fonts)

Die _LUX-Components_ bestehen aus einer Sammlung von _Angular Material_-Komponenten, die speziell für den _JAST_-Stack (**J**ava **A**ngular **S**QL **T**omcat)
entwickelt wurden. Es gibt grundlegende Komponenten wie z.B. _lux-input_, _lux-checkbox_, etc. und komplexere Komponenten wie z.B. _lux-master-detail_ oder _lux-stepper_.
Alle _LUX-Components_ sind einfach zu verwenden und können mit den LUX-Themes _authentic_ und _green_ eingesetzt werden, um eine App-übergreifende User Experience zu gewährleisten.

Aus technischer Sicht handelt es sich bei den _LUX-Components_ um eine
_Angular_-Klassenbibliothek, die via NPM in das eigene Projekt eingebunden wird.

## Demo

Live-Demo (_develop_-Branch):

- [https://lux-demo-dev.gfi.ihk.de](https://lux-demo-dev.gfi.ihk.de)

Live-Demo (_main_-Branch):

- [https://lux-demo.gfi.ihk.de](https://lux-demo.gfi.ihk.de)

Die Demo lokal starten:

- Die _LUX-Components_ via Git klonen.
  
  _Bitte unter Windows sicherstellen, dass lange Dateipfade unterstützt werden:_<br>
  `git config --global core.longpaths true`
- In das entsprechende Verzeichnis wechseln.
- `npm install` ausführen.
- `npm run start:demo` ausführen.
- [http://localhost:4200/](http://localhost:4200/) im Browser öffnen.
- Ausprobieren!

## Dokumentation

Eine ausführliche Dokumentation der _LUX-Components_ befindet sich [hier](https://github.com/IHK-GfI/lux-components/wiki).

## Aktualisierung

Für jede Version ist im dazugehörigen Update Guide (siehe [Dokumentation](https://github.com/IHK-GfI/lux-components/wiki)) dokumentiert, wie eine Aktualisierung durchgeführt werden kann.

## Autoren

- Thomas Dickhut (IHK-GfI)
- Helena Majorek (IHK-GfI)
- Dimitrij Ron (S&N)

## Lizenzhinweis - Icons

Über das Github-Projekt [https://github.com/IHK-GfI/lux-components-icons-and-fonts](https://github.com/IHK-GfI/lux-components-icons-and-fonts) können statt der bisherigen Material- oder Font Awesome-Icons nun auch die "neuen" Streamline-Icons mit eingebunden werden, welche speziell für die Nutzung mit dem Theme-Authentic ausgewählt wurden.
Ab der Version 15.0.0 werden ausschließlich nur noch die Streamline-Icons verwendet, die über das o.g. Projekt eingebunden werden.
Die Streamline Icons laufen unter der Lizenz CC-BY 4.0 und der Urheber ist „streamlinehq.com“ ("Streamline Icons Core Line free Copyright © by streamlinehq.com“).
Bezugsquelle: „[Free Core Line – Free Icons Set - 1000 customizable PNGs, SVGs, PDFs (streamlinehq.com)](https://www.streamlinehq.com/icons/streamline-mini-line)“.
Die Lizenz „[CC BY 4.0“ ist zu finden unter „[Streamline Free License | Streamline Help center (intercom.help)](https://intercom.help/streamlinehq/en/articles/5354376-streamline-free-license)“.
Die Icons aus dem o.a. Iconset wurden durch die IHK-GfI mbH nicht verändert. Zusätzlich wurden eigene Icons im selben Stil erstellt und unserer Sammlung unter gleicher Lizenz hinzugefügt.

> **Note:** Bei der Entwicklung einer Applikation auf Basis der _LUX-Components_ sind die verwendeten Icon-Sets entsprechend zu erwähnen und der Lizenztext ist individuell anzupassen.

## Lizenzhinweis - Fonts

Über das Github-Projekt [https://github.com/IHK-GfI/lux-components-icons-and-fonts](https://github.com/IHK-GfI/lux-components-icons-and-fonts) werden statt der bisher vorgeschlagenen Fontfamilien wie z.B. Korb, Roboto, etc.) nun auch die Schriftarten "Source Sans Pro" entworfen by Paul D. Hunt (Lizenziert unter SIL 1.1 Open Font License) sowie "BloggerSans" created by Sergiy Tkachenko (Lizenziert unter Creative Commons 4.0) verwendet werden, welche speziell für die Nutzung mit dem Theme-authentic ausgewählt wurden.

> **Note:** Bei der Entwicklung einer Applikation auf Basis der _LUX-Components_ sowie unter Nutzung der Schriftart "Source Sans Pro" ist zwingend die Lizenzdatei "SIL Open Font License V1.1.md" in die GUI der Applikation einzubinden. Bei Nutzung der Schriftart "BloggerSans" ist ein Verweis auf die Lizenz unter [https://www.fontsquirrel.com/license/blogger-sans](https://www.fontsquirrel.com/license/blogger-sans) erforderlich. Bei jeder Anwendung ist der Lizenzhinweis zu den tatsächlich verwendeten Schriften und Icons individuell anzupassen!
