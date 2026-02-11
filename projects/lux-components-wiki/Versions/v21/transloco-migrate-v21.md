# Transloco

- [Transloco](#transloco)
  - [Offizieller Weg](#offizieller-weg)
    - [Beispiel](#beispiel)
    - [Fehler](#fehler)
  - [Was kann ich tun, falls die offizielle Migration fehlschlägt?](#was-kann-ich-tun-falls-die-offizielle-migration-fehlschlägt)

Auf dieser Seite wird beschrieben, wie man von der I18N-Lösung des Angular-Teams auf Transloco migriert.

## Offizieller Weg

- [Migrate from Angular's i18n](https://jsverse.gitbook.io/transloco/migration-guides/migrate-from-angulars-i18n)

Leider gibt es aktuell einen Fehler im Transloco-Migrationsskript (v8.0.2). Das Migrationsskript behandelt die I18N-Attribute in den HTML-Templates falsch.

### Beispiel

Eine Migration kann wie folgt ausgeführt werden:

```bash
npm install @jsverse/transloco-schematics
ng g @jsverse/transloco-schematics:ng-migrate --langs "de,en" --path "./src/app" --translation-files-path "./src/locale"
```

### Fehler

Vor der Migration:

```html
<lux-app-header-ac-nav-menu-item
  luxLabel="Information"
  i18n-luxLabel="@@luxbp.home.information"
```

Nach der Migration:

```html
<lux-app-header-ac-nav-menu-item
  luxLabel="Information"
  uxLabel="{{ '@@luxbp.home.information' | transloco }}"
```

Korrekt wäre:

```html
<lux-app-header-ac-nav-menu-item
  luxLabel="{{ 'luxbp.home.information' | transloco }}"
```

Falls es bei der Durchführung des LUX-Components-Update eine neuere Transloco-Version als v8.0.2 gibt, sollte der offizielle Migrationspfad ausprobiert werden.

## Was kann ich tun, falls die offizielle Migration fehlschlägt?

1. Die alten Dateien _messages.xlf_ und _messages.en.xlf_ müssen in das Transloco-JSON-Format umgewandelt werden. Dafür kann das folgende Skript verwendet werden:

   ```bash
   ng g @ihk-gfi/lux-components-update:migrate-xlf
   ```

   Nach dem Ausführen sollten die Dateien _de.json_ und _en.json_ im Ordner _src/locale_ angelegt worden sein. Diese Dateien enthalten nur noch die Übersetzungen der App und **nicht** mehr die Übersetzungen aus den LUX-Components.
1. Die I18N-Tags und Attribute müssen in den HTML-Templates ersetzt werden.

   ```bash
   ng g @ihk-gfi/lux-components-update:migrate-i18n-keys
   ```

   Wichtig! Die Transloco-Importe (_TranslocoPipe_ bzw. __TranslocoModule_) in den TypeScript-Dateien werden nicht automatisch ergänzt. D.h. diese müssen manuell ergänzt werden.

    ```typescript
    import { TranslocoPipe } from '@jsverse/transloco';
  
    @Component({
    selector: 'app-root',
    imports: [
      ...,
      TranslocoPipe
    ]
    })
    ...
    ```

1. Variablen manuell nachpflegen.

   Man sollte die _de.json_ nach Variablen (z.B. _{{myVar}}_) durchsuchen und diese im HTML- oder TS-Template ergänzen.

   Beispiel:

   ```json
   {
    "app.file.upload.delete.btn.arialabel": "Button zum Löschen der Datei {{fileName}}",
   }
   ```

   Nach dem Skript von oben:

   ```html
   <lux-button luxAriaLabel="{{ 'app.file.upload.delete.btn.arialabel' | transloco"></lux-button>
   ```

   Hier fehlt die Angabe der _fileName_-Variablen. Diese muss manuell ergänzt werden.

   Korrekt:

   ```html
   <lux-button luxAriaLabel="{{ 'app.file.upload.delete.btn.arialabel' | transloco: { fileName: file.name } }}"></lux-button>
   ```

1. Sollte man Übersetzungen in den TypeScript-Dateien mit _$localize_ haben, müssen diese manuell ersetzt werden.

   Beispiel:

   Vorher:

   ```typescript
   new LuxAppFooterLinkInfo($localize`:@@luxbp.footer.btn.privacypolicy:Datenschutz`, 'datenschutz', true),
   ```

   Nachher:

   ```typescript
   private tService = inject(TranslocoService);
   ...
   new LuxAppFooterLinkInfo(this.tService.translate(`luxbp.footer.btn.privacypolicy`), 'datenschutz', true),
   ```

   Noch besser wäre die folgende Alternative:

   ```typescript
   import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  
   tService = inject(TranslocoService);

   constructor() {
    this.tService.langChanges$.pipe(takeUntilDestroyed()).subscribe(() => {
       this.updateFooterLinks();
     });
   }
  
   private updateFooterLinks() {
     this.linkService.linkInfos = [
       new LuxAppFooterLinkInfo(this.tService.translate(`luxbp.footer.btn.privacypolicy`), 'datenschutz', true),
       new LuxAppFooterLinkInfo(this.tService.translate(`luxbp.footer.btn.about`), 'impressum', true),
       new LuxAppFooterLinkInfo(this.tService.translate(`luxbp.footer.btn.licensehint`), 'license-hint', true)
     ];
   }
   ```

1. Tests anpassen

   Sollte es in den Tests Transloco-Fehler (z.B. "..._ɵNotFound: NG0201: No provider found for 'InjectionToken TRANSLOCO_TRANSPILER'..._) geben, kann der folgende Provider ergänzt werden:

   ```typescript
   describe('AppComponent', () => {

   beforeEach(waitForAsync(() => {
     TestBed.configureTestingModule({
       imports: [
        ...
       ],
       providers: [
         ...
         provideLuxTranslocoTesting()
      ]
     }).compileComponents();
   }));
   ```

1. Am Ende können die Dateien _messages.xlf_ und _messages.en.xlf_ gelöscht werden.

1. Zurück zum [Update-Guide v21](update-guide-v21).
