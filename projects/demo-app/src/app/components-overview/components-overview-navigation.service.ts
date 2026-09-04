import { Injectable, Signal, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { LuxThemeService } from '@ihk-gfi/lux-components';
import { filter, map } from 'rxjs/operators';
import { DemoMarkerType, DemoNavigationComponentEntry, getDemoMarkerLabel } from '../base/status-marker/status-marker.model';

@Injectable({
  providedIn: 'root'
})
export class ComponentsOverviewNavigationService {
  moduleIcons: Map<string, string> = new Map<string, string>([
    ['action', 'lux-interface-cursor-arrow-1'],
    ['common', 'lux-image-photo-composition-oval'],
    ['directive', 'lux-interface-setting-tool-box'],
    ['error', 'lux-interface-alert-warning-triangle'],
    ['filter', 'lux-interface-text-formatting-filter-1'],
    ['form', 'lux-interface-edit-write-1'],
    ['html', 'lux-interface-file-text'],
    ['icon', 'lux-image-picture-landscape-1'],
    ['layout', 'lux-interface-layout-1'],
    ['lookup', 'lux-interface-edit-binocular'],
    ['markdown', 'lux-interface-file-text'],
    ['pipes', 'lux-interface-dashboard-layout-circle'],
    ['popup', 'lux-programming-browser-window'],
    ['tenant-logo', 'lux-image-picture-landscape-1'],
    ['tour-hint', 'lux-programming-browser-window'],
    ['breadcrumb', 'lux-interface-cursor-arrow-1'],
    ['session-timer', 'lux-interface-time-reset']
  ]);

  readonly currentModuleNames: string[] = [
    'action',
    'breadcrumb',
    'common',
    'directive',
    'error',
    'filter',
    'form',
    'html',
    'icon',
    'layout',
    'lookup',
    'markdown',
    'pipes',
    'popup',
    'session-timer',
    'tenant-logo',
    'tour-hint'
  ];

  readonly currentModules: WritableSignal<Map<string, boolean>> = signal(new Map(this.currentModuleNames.map((moduleName) => [moduleName, false])));

  readonly filteredComponents: Signal<DemoNavigationComponentEntry[]> = computed(() =>
    this.components.filter((component) => !component.themes || !!component.themes.find((theme: string) => theme === this.themeName()))
  );

  readonly sortedComponentEntries: Signal<Map<string, DemoNavigationComponentEntry[]>> = computed(() => {
    const entries = new Map<string, DemoNavigationComponentEntry[]>();
    this.currentModuleNames.forEach((moduleName: string) => {
      entries.set(
        moduleName,
        this.filteredComponents().filter((component) => component.moduleName === moduleName)
      );
    });
    return entries;
  });

  readonly sortedComponents: Signal<DemoNavigationComponentEntry[]> = computed(() =>
    Array.from(this.sortedComponentEntries().values()).flat()
  );

  readonly selectedComponent: Signal<DemoNavigationComponentEntry | null> = computed(() => {
    const lastPath = this.lastUrlSegment().toLowerCase();
    return this.components.find((component) => component.label.toLowerCase() === lastPath) ?? null;
  });

  private readonly themeService = inject(LuxThemeService);
  private readonly router = inject(Router);

  private readonly components: DemoNavigationComponentEntry[] = [
    this.create('action', 'Button', DemoMarkerType.Updated),
    this.create('action', 'Button-Toggle', DemoMarkerType.New),
    this.create('action', 'Link'),
    this.create('action', 'Link-Plain'),
    this.create('action', 'Menu', DemoMarkerType.Updated),
    this.create('common', 'Badge'),
    this.create('common', 'Message-Box'),
    this.create('common', 'Paginator', DemoMarkerType.New),
    this.create('common', 'Progress'),
    this.create('common', 'Spinner'),
    this.create('common', 'Table'),
    this.create('common', 'Table-Edit'),
    this.create('common', 'Table-Server'),
    this.create('common', 'Textbox'),
    this.create('directive', 'Badge-Notification'),
    this.create('directive', 'Infinite-Scrolling'),
    this.create('directive', 'Ripple'),
    this.create('directive', 'Tabindex'),
    this.create('directive', 'Tooltip'),
    this.create('error', 'Error-Page'),
    this.create('error', 'HTTP-Error'),
    this.create('filter', 'Filter'),
    this.create('form', 'Autocomplete-Ac'),
    this.create('form', 'Checkbox-Ac'),
    this.create('form', 'Chips-Ac'),
    this.create('form', 'Datepicker-Ac'),
    this.create('form', 'Datetimepicker-Ac'),
    this.create('form', 'Timepicker', DemoMarkerType.New),
    this.create('form', 'File-Input-Ac'),
    this.create('form', 'File-List'),
    this.create('form', 'File-Upload'),
    this.create('form', 'Input-Ac'),
    this.create('form', 'Radio-Button-Ac'),
    this.create('form', 'Select-Ac', DemoMarkerType.Updated),
    this.create('form', 'Slider-Ac'),
    this.create('form', 'Textarea-Ac'),
    this.create('form', 'Toggle-Ac'),
    this.create('html', 'Html'),
    this.create('icon', 'Icon'),
    this.create('icon', 'Image'),
    this.create('layout', 'Accordion'),
    this.create('layout', 'App-Footer'),
    this.create('layout', 'Card'),
    this.create('layout', 'Checkbox-Container-Ac'),
    this.create('layout', 'Divider'),
    this.create('layout', 'List', DemoMarkerType.Updated),
    {
      onclick: () => this.router.navigate(['components-overview/master-detail-ac']),
      icon: this.moduleIcons.get('layout')!,
      label: 'Master-Detail-Ac',
      moduleName: 'layout'
    },
    this.create('layout', 'Stepper'),
    this.create('layout', 'Stepper-Large'),
    this.create('layout', 'Storage'),
    this.create('layout', 'Tabs'),
    this.create('layout', 'Tile'),
    this.create('layout', 'Tile-Ac'),
    this.create('lookup', 'Lookup-Autocomplete-Ac'),
    this.create('lookup', 'Lookup-Combobox-Ac', DemoMarkerType.Updated),
    this.create('lookup', 'Lookup-Label'),
    this.create('markdown', 'Markdown'),
    this.create('pipes', 'Timestamp'),
    this.create('popup', 'Popup', DemoMarkerType.New),
    this.create('popup', 'Dialog'),
    this.create('popup', 'Consent', DemoMarkerType.New),
    this.create('popup', 'Snackbar'),
    this.create('tenant-logo', 'Tenant-Logo'),
    this.create('tour-hint', 'Tour-Hint'),
    this.create('breadcrumb', 'Breadcrumb'),
    this.create('session-timer', 'Session-Timer', DemoMarkerType.Updated)
  ];

  private readonly themeName: Signal<string> = computed(() => this.themeSignal().name);

  private readonly themeSignal = toSignal(this.themeService.getThemeAsObservable(), { initialValue: this.themeService.getTheme() });

  private readonly lastUrlSegment = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => {
        const urlPaths = event.url.split('/');
        return urlPaths[urlPaths.length - 1] ?? '';
      })
    ),
    { initialValue: '' }
  );

  constructor() {
    // Modul des aktuell ausgewählten Beispiels automatisch aufklappen, alle anderen zuklappen.
    // Läuft bewusst als Effect statt als computed(), da currentModules zusätzlich manuell
    // (auf-/zuklappen per Klick) beschreibbar bleiben muss.
    effect(() => {
      const selected = this.selectedComponent();
      const expandedByModule = new Map<string, boolean>();
      this.currentModuleNames.forEach((moduleName: string) => expandedByModule.set(moduleName, selected ? moduleName === selected.moduleName : false));
      this.currentModules.set(expandedByModule);
    });
  }

  getFilteredComponents(filterValue: string) {
    const newValue = filterValue ? filterValue.trim().toLowerCase() : '';
    return this.filteredComponents().filter((component) => component.label.toLowerCase().includes(newValue));
  }

  getMarkerLabel(markerType?: DemoMarkerType) {
    return getDemoMarkerLabel(markerType);
  }

  goTo(id: string): void {
    this.router.navigate([`components-overview/example/${id}`]);
  }

  onExpandAll() {
    this.currentModules.update((current) => new Map(Array.from(current.keys(), (moduleName) => [moduleName, true])));
  }

  onCollapseAll() {
    this.currentModules.update((current) => new Map(Array.from(current.keys(), (moduleName) => [moduleName, false])));
  }

  toggleModule(moduleName: string) {
    this.currentModules.update((current) => {
      const next = new Map(current);
      next.set(moduleName, !next.get(moduleName));
      return next;
    });
  }

  navigateToPrevComponent() {
    const currentComponent = this.selectedComponent();
    const sortedComponents = this.sortedComponents();
    const currentIndex = sortedComponents.findIndex((component) => component.label === currentComponent?.label);
    sortedComponents[currentIndex > 0 ? currentIndex - 1 : sortedComponents.length - 1].onclick();
  }

  navigateToNextComponent() {
    const currentComponent = this.selectedComponent();
    const sortedComponents = this.sortedComponents();
    const currentIndex = sortedComponents.findIndex((component) => component.label === currentComponent?.label);
    sortedComponents[currentIndex < sortedComponents.length - 1 ? currentIndex + 1 : 0].onclick();
  }

  private create(moduleName: string, label: string, markerType?: DemoMarkerType): DemoNavigationComponentEntry {
    return {
      onclick: () => this.goTo(label.toLowerCase()),
      icon: this.moduleIcons.get(moduleName)!,
      label,
      moduleName,
      markerType
    };
  }
}
