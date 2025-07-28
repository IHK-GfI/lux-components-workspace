# Lux-Session-Timer

![Beispielbild Lux-Session-Timer](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v19/lux-session-timer-v19-img.png)

- [Lux-Session-Timer](#lux-session-timer)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
  - [Setup](#setup)
    - [1. Konfiguration](#1-konfiguration)
    - [2. Komponente einbinden](#2-komponente-einbinden)
  - [Beispiel](#beispiel)
    - [Vollständiges Beispiel](#vollständiges-beispiel)

## Overview / API

Die `lux-app-header-ac-session-timer`-Komponente zeigt die verbleibende Zeit der aktuellen Session an, öffnet automatisch einen Dialog, wenn die Session abzulaufen droht, und ermöglicht die Verlängerung der Session. Der Timer wird nur angezeigt wenn die verbleibende Zeit weniger als eine Stunde ist. Der Session Timer bekommt die Zeit über einen Interceptor. Dieser reagiert auf den Header `X-Session-Time` in HTTP-Antworten und setzt den Timer auf den angegebenen Wert (in Sekunden).

### Allgemein

| Name     | Beschreibung                      |
| -------- | --------------------------------- |
| selector | `lux-app-header-ac-session-timer` |

### 1. Konfiguration

In der `app.config.ts` müssen die Endpunkte für den Session-Timer über den `LuxComponentsConfigModule` konfiguriert werden.

```typescript
// app.config.ts
const myConfiguration: LuxComponentsConfigParameters = {
  // ... andere Konfigurationen
  sessionTimerConfig: {
    url: '/api/session', // URL die aufgerufen wird, wenn die Session verlängert werden soll. Ein Request wird nur gesendet wenn die Session auch verlängert werden darf.
    logoutUrl: '/api/logout', // Diese Url wird aufgerufen wenn die Session nicht verlängert wird und der User ausgeloggt wird.
    loginUrl: '/login' // Die Url wird aufgerufen, wenn der User ausgeloggt wurde und über die Buttons im Dialog zurück zur Login-Seite navigieren kann.
  }
};
```

### 2. Komponente einbinden

Die Komponente soll im Menü des App-Headers anzeigezigt werden.

```html
<lux-app-header-ac>
  <lux-app-header-ac-action-nav>
    <lux-app-header-ac-session-timer></lux-app-header-ac-session-timer>
  </lux-app-header-ac-action-nav>
</lux-app-header-ac>
```
