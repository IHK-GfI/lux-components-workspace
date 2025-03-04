import { Routes } from '@angular/router';

// prettier-ignore
export const COMPONENT_OVERVIEW_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components-overview.component').then(m => m.ComponentsOverviewComponent) },
  {
    path: 'example', loadComponent: () => import('../example-base/example-base-root/example-root.component').then(m => m.ExampleRootComponent), children: [
      { path: 'accordion', loadComponent: () => import('./accordion-example/accordion-example.component').then(m => m.AccordionExampleComponent) },
      { path: 'autocomplete-ac', loadComponent: () => import('./autocomplete-authentic-example/autocomplete-authentic-example.component').then(m => m.AutocompleteAuthenticExampleComponent) },
      { path: 'badge', loadComponent: () => import('./badge-example/badge-example.component').then(m => m.BadgeExampleComponent) },
      { path: 'button', loadComponent: () => import('./button-example/button-example.component').then(m => m.ButtonExampleComponent) },
      { path: 'card', loadComponent: () => import('./card-example/card-example.component').then(m => m.CardExampleComponent) },
      { path: 'chips-ac', loadComponent: () => import('./chip-authentic-example/chip-authentic-example.component').then(m => m.ChipAuthenticExampleComponent) },
      { path: 'datepicker-ac', loadComponent: () => import('./datepicker-authentic-example/datepicker-authentic-example.component').then(m => m.DatepickerAuthenticExampleComponent) },
      { path: 'datetimepicker-ac', loadComponent: () => import('./datetimepicker-authentic-example/datetimepicker-authentic-example.component').then(m => m.DatetimepickerAuthenticExampleComponent) },
      { path: 'divider', loadComponent: () => import('./divider-example/divider-example.component').then(m => m.DividerExampleComponent) },
      { path: 'error-page', loadComponent: () => import('./errorpage-example/errorpage-example.component').then(m => m.ErrorpageExampleComponent) },
      { path: 'http-error', loadComponent: () => import('./http-error-example/http-error-example.component').then(m => m.HttpErrorExampleComponent) },
      { path: 'icon', loadComponent: () => import('./icon-example/icon-example.component').then(m => m.IconExampleComponent) },
      { path: 'image', loadComponent: () => import('./image-example/image-example.component').then(m => m.ImageExampleComponent) },
      { path: 'link', loadComponent: () => import('./link-example/link-example.component').then(m => m.LinkExampleComponent) },
      { path: 'progress', loadComponent: () => import('./progress-example/progress-example.component').then(m => m.ProgressBarExampleComponent) },
      { path: 'radio-button-ac', loadComponent: () => import('./radio-authentic-example/radio-authentic-example.component').then(m => m.RadioAuthenticExampleComponent) },
      { path: 'select-ac', loadComponent: () => import('./select-authentic-example/select-authentic-example.component').then(m => m.SelectAuthenticExampleComponent) },
      { path: 'slider-ac', loadComponent: () => import('./slider-authentic-example/slider-authentic-example.component').then(m => m.SliderAuthenticExampleComponent) },
      { path: 'snackbar', loadComponent: () => import('./snackbar-example/snackbar-example.component').then(m => m.SnackbarExampleComponent) },
      { path: 'spinner', loadComponent: () => import('./spinner-example/spinner-example.component').then(m => m.SpinnerExampleComponent) },
      { path: 'storage', loadComponent: () => import('./storage-example/storage-example.component').then(m => m.StorageExampleComponent) },
      { path: 'table', loadComponent: () => import('./table-example/table-example.component').then(m => m.TableExampleComponent) },
      { path: 'table-server', loadComponent: () => import('./table-server-example/table-server-example.component').then(m => m.TableServerExampleComponent) },
      { path: 'textarea-ac', loadComponent: () => import('./textarea-authentic-example/textarea-authentic-example.component').then(m => m.TextareaAuthenticExampleComponent) },
      { path: 'tooltip', loadComponent: () => import('./tooltip-example/tooltip-example.component').then(m => m.TooltipExampleComponent) },
      { path: 'lookup-combobox-ac', loadComponent: () => import('./lookup-examples/lookup-combobox-ac-example/lookup-combobox-ac-example.component').then(m => m.LookupComboboxAcExampleComponent) },
      { path: 'lookup-autocomplete-ac', loadComponent: () => import('./lookup-examples/lookup-autocomplete-ac-example/lookup-autocomplete-ac-example.component').then(m => m.LookupAutocompleteAcExampleComponent) },
      { path: 'lookup-label', loadComponent: () => import('./lookup-examples/lookup-label-example/lookup-label-example.component').then(m => m.LookupLabelExampleComponent) },
      { path: 'tabindex', loadComponent: () => import('./tabindex-example/tabindex-example.component').then(m => m.TabindexExampleComponent) },
      { path: 'message-box', loadComponent: () => import('./message-box-example/message-box-example.component').then(m => m.MessageBoxExampleComponent) },
      { path: 'menu', loadComponent: () => import('./menu-example/menu-example.component').then(m => m.MenuExampleComponent) },
      { path: 'app-footer', loadComponent: () => import('./app-footer-example/app-footer-example.component').then(m => m.AppFooterExampleComponent) },
      { path: 'toggle-ac', loadComponent: () => import('./toggle-authentic-example/toggle-authentic-example.component').then(m => m.ToggleAuthenticExampleComponent) },
      { path: 'list', loadComponent: () => import('./list-example/list-example.component').then(m => m.ListExampleComponent) },
      { path: 'timestamp', loadComponent: () => import('./timestamp-example/timestamp-example.component').then(m => m.TimestampExampleComponent) },
      { path: 'stepper', loadComponent: () => import('./stepper-example/stepper-example.component').then(m => m.StepperExampleComponent) },
      { path: 'stepper-large', loadComponent: () => import('./stepper-large-example/stepper-large-example.component').then(m => m.StepperLargeExampleComponent) },
      { path: 'tabs', loadComponent: () => import('./tabs-example/tabs-example.component').then(m => m.TabsExampleComponent) },
      { path: 'infinite-scrolling', loadComponent: () => import('./infinite-scrolling-example/infinite-scrolling-example.component').then(m => m.InfiniteScrollingExampleComponent) },
      { path: 'dialog', loadComponent: () => import('./dialog-example/dialog-example.component').then(m => m.DialogExampleComponent) },
      { path: 'file-input-ac', loadComponent: () => import('./file-example/file-input-authentic-example/file-input-authentic-example.component').then(m => m.FileInputAuthenticExampleComponent) },
      { path: 'file-list', loadComponent: () => import('./file-example/file-list-example/file-list-example.component').then(m => m.FileListExampleComponent) },
      { path: 'file-upload', loadComponent: () => import('./file-example/file-upload-example/file-upload-example.component').then(m => m.FileUploadExampleComponent) },
      { path: 'badge-notification', loadComponent: () => import('./badge-notification-example/badge-notification-example.component').then(m => m.BadgeNotificationExampleComponent) },
      { path: 'ripple', loadComponent: () => import('./ripple-example/ripple-example.component').then(m => m.RippleExampleComponent) },
      { path: 'html', loadComponent: () => import('./html-example/html-example.component').then(m => m.HtmlExampleComponent) },
      { path: 'markdown', loadComponent: () => import('./markdown-example/markdown-example.component').then(m => m.MarkdownExampleComponent) },
      { path: 'filter', loadComponent: () => import('./filter-example/filter-example.component').then(m => m.FilterExampleComponent) },
      { path: 'link-plain', loadComponent: () => import('./link-plain-example/link-plain-example.component').then(m => m.LinkPlainExampleComponent) },
      { path: 'tile', loadComponent: () => import('./tile-example/tile-example.component').then(m => m.TileExampleComponent) },
      { path: 'tile-ac', loadComponent: () => import('./tile-authentic-example/tile-authentic-example.component').then(m => m.TileAuthenticExampleComponent) },
      { path: 'input-ac', loadComponent: () => import('./input-authentic-example/input-authentic-example.component').then(m => m.InputAuthenticExampleComponent) },
      { path: 'checkbox-ac', loadComponent: () => import('./checkbox-authentic-example/checkbox-authentic-example.component').then(m => m.CheckboxAuthenticExampleComponent) },
      { path: 'tile-overview', loadComponent: () => import('./tile-authentic-example/overview-example/overview-example.component').then(m => m.OverviewExampleComponent) },
      { path: 'master-detail-ac', loadComponent: () => import('./master-detail-authentic-example/master-detail-authentic-example.component').then(m => m.MasterDetailAuthenticExampleComponent) },
      { path: 'checkbox-container-ac', loadComponent: () => import('./checkbox-container-ac-example/checkbox-container-ac-example.component').then(m => m.CheckboxContainerAcExampleComponent) },
      { path: 'textbox', loadComponent: () => import('./textbox-example/textbox-example.component').then(m => m.TextboxExampleComponent) },
      { path: 'tenant-logo', loadComponent: () => import('./tenant-logo-example/tenant-logo-example.component').then(m => m.TenantLogoExampleComponent) },
      { path: 'tour-hint', loadComponent: () => import('./tour-hint-example/tour-hint-example.component').then(m => m.TourHintExampleComponent) },
      { path: 'breadcrumb', loadComponent: () => import('./breadcrumb-example/breadcrumb-example.component').then(m => m.BreadcrumbExampleComponent) }
    ]
  }
];
