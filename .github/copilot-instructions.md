---
applyTo: '**'
---

# Copilot instructions for lux-components-workspace

## Big picture

- Angular monorepo with multiple workspaces under projects/: the component library, a demo app, a theme package, and update schematics.
- Core library exports are centralized in [projects/lux-components-lib/src/public_api.ts](projects/lux-components-lib/src/public_api.ts); ng-packagr entry is [projects/lux-components-lib/ng-package.json](projects/lux-components-lib/ng-package.json).
- The demo app consumes the library and themes; it uses transloco for translations, and theme CSS from dist/theme (see assets in [angular.json](angular.json)).
- Themes are CSS variables + classes (Material Theme 3). Variables live under projects/lux-components-theme/src/<themeName>/\_variables\*.scss.
- Update scripts are Angular schematics in projects/lux-components-update (see README).

## Key workflows (Windows-friendly)

- Install: npm install (Node >= 20.19; see package.json engines).
- Run demo: npm run start:demo (checks demo conditions, then ng serve).
- Dev watch loop: npm run start:dev (builds library + theme in watch mode, then starts demo when dist outputs exist).
- Build all packages: npm run pack:all (cleans dist, then builds theme, library, updater, demo).
- Tests: npm run test:components (lint + Karma headless for library), npm run test:all (demo/theme/updater smoke tests).

## Project-specific conventions

- Library public API: add new exports to public_api.ts to expose components/services.
- Assets packaging: lux-components-lib includes locale JSON + LICENSE via ng-packagr assets.
- Translations use Transloco; see demo app setup in [projects/demo-app/src/app/transloco-root.config.ts](projects/demo-app/src/app/transloco-root.config.ts) and loader in [projects/demo-app/src/app/transloco-loader.ts](projects/demo-app/src/app/transloco-loader.ts).
- Schematics: for updates use ng generate @ihk-gfi/lux-components-update:update-19.x.x (dry-run supported).

## Integration points

- Dependencies include Angular 21, Angular Material, Transloco, DOMPurify, marked, ngx-cookie-service, uuid.
- External icon + font package: @ihk-gfi/lux-components-icons-and-fonts (license notes in root README).
