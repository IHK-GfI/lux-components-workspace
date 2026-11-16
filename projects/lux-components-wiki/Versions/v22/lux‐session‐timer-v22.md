# LUX-Session-Timer

![Beispielbild LUX-Session-Timer](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐session‐timer-v22-img.png)

- [LUX-Session-Timer](#lux-session-timer)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Output](#output)
  - [Services](#services)
    - [LuxAppHeaderAcSessionTimerService](#luxappheaderacsessiontimerservice)
    - [luxSessionTimerInterceptor](#luxsessiontimerinterceptor)
  - [Setup](#setup)
    - [Einwilligung](#einwilligung)
    - [Konfiguration](#konfiguration)
    - [Komponente einbinden](#komponente-einbinden)

## Overview / API

Die `lux-app-header-ac-session-timer`-Komponente zeigt die verbleibende Zeit der aktuellen Session an, öffnet automatisch einen Dialog, wenn die Session abzulaufen droht, und ermöglicht die Verlängerung der Session. Der Timer wird nur angezeigt, wenn die verbleibende Zeit weniger als eine Stunde ist. Wenn die verbleibende Zeit weniger als eine Minute ist, werden die restlichen Sekunden angezeigt. Der Session-Timer erhält die Zeit über einen Interceptor. Dieser reagiert standardmäßig auf den Header `X-GfI-Session-Time` in HTTP-Antworten und setzt den Timer auf den angegebenen Wert (in Sekunden).

### Allgemein

| Name     | Beschreibung                      |
| -------- | --------------------------------- |
| selector | `lux-app-header-ac-session-timer` |

### @Output

| Name            | Typ  | Beschreibung                                                                     |
| --------------- | ---- | -------------------------------------------------------------------------------- |
| luxTimeoutEvent | void | Dieses Event wird ausgelöst, wenn die Session abläuft (Timeout).                 |
| luxLogoutEvent  | void | Dieses Event wird ausgelöst, wenn der User im Session-Timer den Logout ausführt. |

## Services

### LuxAppHeaderAcSessionTimerService

Der Service verwaltet die Restzeit der Session (`providedIn: 'root'`). Die wichtigsten öffentlichen Methoden:

| Methode                    | Beschreibung                                                                                             |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| resetTimer(seconds: number) | Setzt den Timer auf die übergebene Restzeit in Sekunden (wird vom Interceptor aufgerufen).              |
| extendSessionTimer()       | Ruft die konfigurierte URL (`sessionTimerConfig.url`) auf, um die Session zu verlängern (nur wenn erlaubt). |
| clearTimer()               | Beendet den Timer und entfernt die gespeicherte Endzeit (z.B. beim Logout).                             |

### luxSessionTimerInterceptor

Funktionaler Interceptor (`HttpInterceptorFn`), der die Header `X-GfI-Session-Time` (Restzeit) und `X-GfI-Session-Prolongation` (Verlängerung erlaubt) aus den HTTP-Antworten liest und an den Service weitergibt. Die Header-Namen lassen sich über die [sessionTimerConfig](config-v22#sessiontimerconfig) anpassen.

## Setup

### Einwilligung

Der Session-Timer verwendet zur Berechnung der Restzeit den Local Storage. Dies MUSS in der Einwilligungserklärung der Seite erwähnt werden (siehe [lux-consent](lux‐consent-v22)).

```typescript
export const appConsentProvider = {
  provide: LUX_CONSENT_CONFIG,
  useFactory: () => ({
    cookieKey: 'lux-blueprint-consent',
    // ...
    entries: [
      // ...
      {
        type: LuxConsentStorageType.LocalStorage,
        name: 'lux-components-session-endtime',
        processingCountry: 'Deutschland',
        purpose: LuxConsentPurpose.Essential,
        duration: 'solange eine Sitzung aktiv ist',
        description: 'Wird zur Speicherung der verbleibenden Sessiondauer benötigt. Es wird mit Sitzungsende gelöscht.'
      }
    ]
  })
};
```

### Konfiguration

In der `app.config.ts` müssen die Endpunkte für den Session-Timer über `provideLuxComponentsConfig(myConfiguration)` konfiguriert und der Interceptor registriert werden.

```typescript
// app.config.ts
const myConfiguration: LuxComponentsConfigParameters = {
  // ... andere Konfigurationen
  sessionTimerConfig: {
    url: '/api/session', // URL, die aufgerufen wird, wenn die Session verlängert werden soll. Ein Request wird nur gesendet, wenn die Session auch verlängert werden darf.
    // Optional:
    httpSessionTimeHeaderName: 'X-GfI-Session-Time', // Der Name des HTTP-Headers, aus dem die Session-Zeit ausgelesen wird. 'X-GfI-Session-Time' wird standardmäßig verwendet, wenn der Name des Headers abweicht, muss dieser Parameter gesetzt werden.
    httpSessionProlongationHeaderName: 'X-GfI-Session-Prolongation', // Dieser HTTP-Header wird genutzt, um zu entscheiden, ob die Session verlängert werden darf. Standardmäßig wird der Header 'X-GfI-Session-Prolongation' genutzt, wenn ein anderer Header genutzt wird, muss der Parameter gesetzt werden.
    localStorageKeyName: 'lux-components-session-endtime' // Der Timer speichert die Endzeit im LocalStorage. Der Name des Keys kann geändert werden, um Konflikte zwischen Anwendungen zu vermeiden. Standardmäßig wird 'lux-components-session-endtime' benutzt.
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    // ... andere Konfigurationen
    provideLuxComponentsConfig(myConfiguration),
    provideHttpClient(withInterceptors([luxSessionTimerInterceptor]))
  ]
};
```

### Komponente einbinden

Die Komponente wird im Action-Menü des App-Headers angezeigt.

```html
<lux-app-header-ac>
  <lux-app-header-ac-action-nav>
    <lux-app-header-ac-session-timer
      (luxTimeoutEvent)="sharedService.onSessionTimeout()"
      (luxLogoutEvent)="sharedService.logout(true)"
    />
  </lux-app-header-ac-action-nav>
</lux-app-header-ac>
```

```typescript
// shared.service.ts
private readonly sessionTimerService = inject(LuxAppHeaderAcSessionTimerService);
// ...
logout(withRedirect: boolean): void {
  // ...
  this.sessionTimerService.clearTimer();
  // ...
}
```
