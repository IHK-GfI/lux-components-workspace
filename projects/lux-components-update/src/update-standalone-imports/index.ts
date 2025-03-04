import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { readFile } from '../utility/files';
import { addComponentimport, addimport, removeComponentimport, removeimport } from '../utility/typescript';
import { messageInfoRule } from '../utility/util';

interface Options {
  path: string;
  import: string;
}

interface ComponentInfo {
  htmlChecker: HtmlChecker;
  className: string;
}

interface HtmlChecker {
  test(html: string): boolean;
}

class TagChecker implements HtmlChecker {
  private tagRegEx;
  private tagName;

  constructor(tagName: string) {
    this.tagName = tagName;
    this.tagRegEx = new RegExp(`<${this.tagName}(\\s|>)`, 'i');
  }

  public test(html: string): boolean {
    return this.tagRegEx.test(html);
  }
}

class AttributeChecker implements HtmlChecker {
  private attrRegEx;
  private attrName;

  constructor(attrName: string) {
    this.attrName = attrName;
    this.attrRegEx = new RegExp(`${this.attrName}`, 'i');
  }

  public test(html: string): boolean {
    return this.attrRegEx.test(html);
  }
}

const OLD_MODULE_NAMES = [
  'LuxActionModule',
  'LuxBreadcrumbModule',
  'LuxCommonModule',
  'LuxErrorModule',
  'LuxFilePreviewModule',
  'LuxFilterModule',
  'LuxFormModule',
  'LuxHtmlModule',
  'LuxIconModule',
  'LuxLayoutModule',
  'LuxLookupModule',
  'LuxMarkdwonModule',
  'LuxPipesModule',
  'LuxPopupsModule',
  'LuxTenantLogoModule',
  'LuxTourHintModule'
];

const componentInfos: ComponentInfo[] = [
  {
    htmlChecker: new TagChecker('lux-autocomplete-ac'),
    className: 'LuxAutocompleteAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-checkbox-ac'),
    className: 'LuxCheckboxAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-chip-ac'),
    className: 'LuxChipAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-chip-ac-group'),
    className: 'LuxChipAcGroupComponent'
  },
  {
    htmlChecker: new TagChecker('lux-chips-ac'),
    className: 'LuxChipsAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-datepicker-ac'),
    className: 'LuxDatepickerAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-datetimepicker-ac'),
    className: 'LuxDatetimepickerAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-file-input-ac'),
    className: 'LuxFileInputAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-file-list'),
    className: 'LuxFileListComponent'
  },
  {
    htmlChecker: new TagChecker('lux-file-upload'),
    className: 'LuxFileUploadComponent'
  },
  {
    htmlChecker: new TagChecker('lux-form-hint'),
    className: 'LuxFormHintComponent'
  },
  {
    htmlChecker: new TagChecker('lux-form-label'),
    className: 'LuxFormLabelComponent'
  },
  {
    htmlChecker: new TagChecker('lux-input-ac'),
    className: 'LuxInputAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-input-ac-prefix'),
    className: 'LuxInputAcPrefixComponent'
  },
  {
    htmlChecker: new TagChecker('lux-input-ac-suffix'),
    className: 'LuxInputAcSuffixComponent'
  },
  {
    htmlChecker: new TagChecker('lux-radio-ac'),
    className: 'LuxRadioAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-select-ac'),
    className: 'LuxSelectAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-slider-ac'),
    className: 'LuxSliderAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-textarea-ac'),
    className: 'LuxTextareaAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-toggle-ac'),
    className: 'LuxToggleAcComponent'
  },
  {
    htmlChecker: new TagChecker('luxInfiniteScroll'),
    className: 'LuxInfiniteScrollDirective'
  },
  {
    htmlChecker: new TagChecker('luxTagIdHandler'),
    className: 'LuxTagIdDirective'
  },
  {
    htmlChecker: new TagChecker('luxTooltip'),
    className: 'LuxTooltipDirective'
  },
  {
    htmlChecker: new TagChecker('luxTabIndex'),
    className: 'LuxTabIndexDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaLabel'),
    className: 'LuxAriaLabelDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaExpanded'),
    className: 'LuxAriaExpandedDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaRole'),
    className: 'LuxAriaRoleDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaHasPopup'),
    className: 'LuxAriaHaspopupDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaHidden'),
    className: 'LuxAriaHiddenDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaDescribedby'),
    className: 'LuxAriaDescribedbyDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaInvalid'),
    className: 'LuxAriaInvalidDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaRequired'),
    className: 'LuxAriaRequiredDirective'
  },
  {
    htmlChecker: new TagChecker('luxAriaLabelledby'),
    className: 'LuxAriaLabelledbyDirective'
  },
  {
    htmlChecker: new TagChecker('luxBadgeNotification'),
    className: 'LuxBadgeNotificationDirective'
  },
  {
    htmlChecker: new TagChecker('lux-badge-notification'),
    className: 'LuxBadgeNotificationDirective'
  },
  {
    htmlChecker: new TagChecker('luxRipple'),
    className: 'LuxRippleDirective'
  },
  {
    htmlChecker: new TagChecker('lux-ripple'),
    className: 'LuxRippleDirective'
  },
  {
    htmlChecker: new TagChecker('lux-app-header'),
    className: 'LuxAppHeaderComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-footer'),
    className: 'LuxAppFooterComponent'
  },
  {
    htmlChecker: new TagChecker('lux-list-item'),
    className: 'LuxListItemComponent'
  },
  {
    htmlChecker: new TagChecker('lux-list-item-icon'),
    className: 'LuxListItemIconComponent'
  },
  {
    htmlChecker: new TagChecker('lux-list-item-content'),
    className: 'LuxListItemContentComponent'
  },
  {
    htmlChecker: new TagChecker('lux-list'),
    className: 'LuxListComponent'
  },
  {
    htmlChecker: new TagChecker('lux-tab'),
    className: 'LuxTabComponent'
  },
  {
    htmlChecker: new TagChecker('lux-tabs'),
    className: 'LuxTabsComponent'
  },
  {
    htmlChecker: new TagChecker('lux-card'),
    className: 'LuxCardComponent'
  },
  {
    htmlChecker: new TagChecker('lux-card-info'),
    className: 'LuxCardInfoComponent'
  },
  {
    htmlChecker: new TagChecker('lux-card-content'),
    className: 'LuxCardContentComponent'
  },
  {
    htmlChecker: new TagChecker('lux-card-content-expanded'),
    className: 'LuxCardContentExpandedComponent'
  },
  {
    htmlChecker: new TagChecker('lux-card-actions'),
    className: 'LuxCardActionsComponent'
  },
  {
    htmlChecker: new TagChecker('lux-accordion'),
    className: 'LuxAccordionComponent'
  },
  {
    htmlChecker: new TagChecker('lux-panel'),
    className: 'LuxPanelComponent'
  },
  {
    htmlChecker: new TagChecker('lux-panel-content'),
    className: 'LuxPanelContentComponent'
  },
  {
    htmlChecker: new TagChecker('lux-panel-action'),
    className: 'LuxPanelActionComponent'
  },
  {
    htmlChecker: new TagChecker('lux-panel-header-title'),
    className: 'LuxPanelHeaderTitleComponent'
  },
  {
    htmlChecker: new TagChecker('lux-panel-header-description'),
    className: 'LuxPanelHeaderDescriptionComponent'
  },
  {
    htmlChecker: new TagChecker('lux-stepper'),
    className: 'LuxStepperComponent'
  },
  {
    htmlChecker: new TagChecker('lux-step'),
    className: 'LuxStepComponent'
  },
  {
    htmlChecker: new TagChecker('lux-step-header'),
    className: 'LuxStepHeaderComponent'
  },
  {
    htmlChecker: new TagChecker('lux-step-content'),
    className: 'LuxStepContentComponent'
  },
  {
    htmlChecker: new TagChecker('lux-divider'),
    className: 'LuxDividerComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-right-nav'),
    className: 'LuxAppHeaderRightNavComponent'
  },
  {
    htmlChecker: new TagChecker('lux-side-nav'),
    className: 'LuxSideNavComponent'
  },
  {
    htmlChecker: new TagChecker('lux-side-nav-footer'),
    className: 'LuxSideNavFooterComponent'
  },
  {
    htmlChecker: new TagChecker('lux-side-nav-header'),
    className: 'LuxSideNavHeaderComponent'
  },
  {
    htmlChecker: new TagChecker('lux-side-nav-item'),
    className: 'LuxSideNavItemComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-content'),
    className: 'LuxAppContentComponent'
  },
  {
    htmlChecker: new TagChecker('lux-stepper-horizontal'),
    className: 'LuxStepperHorizontalComponent'
  },
  {
    htmlChecker: new TagChecker('lux-stepper-nav-buttons'),
    className: 'LuxStepperNavButtonsComponent'
  },
  {
    htmlChecker: new TagChecker('lux-stepper-vertical'),
    className: 'LuxStepperVerticalComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-action-nav'),
    className: 'LuxAppHeaderActionNavComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-action-nav-item'),
    className: 'LuxAppHeaderActionNavItemComponent'
  },
  {
    htmlChecker: new TagChecker('lux-lang-select'),
    className: 'LuxLangSelectComponent'
  },
  {
    htmlChecker: new TagChecker('lux-stepper-large'),
    className: 'LuxStepperLargeComponent'
  },
  {
    htmlChecker: new TagChecker('lux-stepper-large-step'),
    className: 'LuxStepperLargeStepComponent'
  },
  {
    htmlChecker: new TagChecker('lux-stepper-large-mobile-overlay'),
    className: 'LuxStepperLargeMobileOverlayComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-ac'),
    className: 'LuxAppHeaderAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-ac-user-menu'),
    className: 'LuxAppHeaderAcUserMenuComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-ac-nav-menu'),
    className: 'LuxAppHeaderAcNavMenuComponent'
  },
  {
    htmlChecker: new TagChecker('lux-tile'),
    className: 'LuxTileComponent'
  },
  {
    htmlChecker: new TagChecker('lux-tile-ac'),
    className: 'LuxTileAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-action-nav-item-custom'),
    className: 'LuxAppHeaderActionNavItemCustomComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-ac-nav-menu-item'),
    className: 'LuxAppHeaderAcNavMenuItemComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-ac-action-nav'),
    className: 'LuxAppHeaderAcActionNavComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-ac-action-nav-item'),
    className: 'LuxAppHeaderAcActionNavItemComponent'
  },
  {
    htmlChecker: new TagChecker('lux-app-header-ac-action-nav-item-custom'),
    className: 'LuxAppHeaderAcActionNavItemCustomComponent'
  },
  {
    htmlChecker: new TagChecker('lux-detail-view-ac'),
    className: 'LuxDetailViewAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-detail-wrapper-ac'),
    className: 'LuxDetailWrapperAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-master-footer-ac'),
    className: 'LuxMasterFooterAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-master-header-content-ac'),
    className: 'LuxMasterHeaderContentAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-master-header-ac'),
    className: 'LuxMasterHeaderAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-master-detail-ac'),
    className: 'LuxMasterDetailAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-master-list-ac'),
    className: 'LuxMasterListAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-detail-header-ac'),
    className: 'LuxDetailHeaderAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-checkbox-container-ac'),
    className: 'LuxCheckboxContainerAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-button'),
    className: 'LuxButtonComponent'
  },
  {
    htmlChecker: new TagChecker('lux-menu-item'),
    className: 'LuxMenuItemComponent'
  },
  {
    htmlChecker: new TagChecker('lux-link'),
    className: 'LuxLinkComponent'
  },
  {
    htmlChecker: new TagChecker('lux-menu'),
    className: 'LuxMenuComponent'
  },
  {
    htmlChecker: new TagChecker('lux-menu-trigger'),
    className: 'LuxMenuTriggerComponent'
  },
  {
    htmlChecker: new TagChecker('lux-link-plain'),
    className: 'LuxLinkPlainComponent'
  },
  {
    htmlChecker: new TagChecker('lux-breadcrumb'),
    className: 'LuxBreadcrumbComponent'
  },
  {
    htmlChecker: new TagChecker('lux-label'),
    className: 'LuxLabelComponent'
  },
  {
    htmlChecker: new TagChecker('lux-badge'),
    className: 'LuxBadgeComponent'
  },
  {
    htmlChecker: new TagChecker('lux-progress'),
    className: 'LuxProgressComponent'
  },
  {
    htmlChecker: new TagChecker('lux-table'),
    className: 'LuxTableComponent'
  },
  {
    htmlChecker: new TagChecker('lux-table-column-footer'),
    className: 'LuxTableColumnFooterComponent'
  },
  {
    htmlChecker: new TagChecker('lux-table-column'),
    className: 'LuxTableColumnComponent'
  },
  {
    htmlChecker: new TagChecker('lux-table-column-header'),
    className: 'LuxTableColumnHeaderComponent'
  },
  {
    htmlChecker: new TagChecker('lux-table-column-content'),
    className: 'LuxTableColumnContentComponent'
  },
  {
    htmlChecker: new TagChecker('lux-message-box'),
    className: 'LuxMessageBoxComponent'
  },
  {
    htmlChecker: new TagChecker('lux-message'),
    className: 'LuxMessageComponent'
  },
  {
    htmlChecker: new TagChecker('lux-textbox'),
    className: 'LuxTextboxComponent'
  },
  {
    htmlChecker: new TagChecker('lux-http-error'),
    className: 'LuxHttpErrorComponent'
  },
  {
    htmlChecker: new TagChecker('lux-error-page'),
    className: 'LuxErrorPageComponent'
  },
  {
    htmlChecker: new TagChecker('lux-file-preview'),
    className: 'LuxFilePreviewComponent'
  },
  {
    htmlChecker: new TagChecker('lux-file-preview-toolbar'),
    className: 'LuxFilePreviewToolbarComponent'
  },
  {
    htmlChecker: new TagChecker('lux-file-preview-pdfviewer'),
    className: 'LuxFilePreviewPdfViewerComponent'
  },
  {
    htmlChecker: new TagChecker('lux-file-preview-imgviewer'),
    className: 'LuxFilePreviewImgViewerComponent'
  },
  {
    htmlChecker: new TagChecker('lux-file-preview-notsupportedviewer'),
    className: 'LuxFilePreviewNotSupportedViewerComponent'
  },
  {
    htmlChecker: new TagChecker('lux-filter-form'),
    className: 'LuxFilterFormComponent'
  },
  {
    htmlChecker: new AttributeChecker('luxFilterItem'),
    className: 'LuxFilterItemDirective'
  },
  {
    htmlChecker: new TagChecker('lux-filter-save-dialog'),
    className: 'LuxFilterSaveDialogComponent'
  },
  {
    htmlChecker: new TagChecker('lux-filter-load-dialog'),
    className: 'LuxFilterLoadDialogComponent'
  },
  {
    htmlChecker: new TagChecker('lux-filter-form-extended'),
    className: 'LuxFilterFormExtendedComponent'
  },
  {
    htmlChecker: new TagChecker('lux-html'),
    className: 'LuxHtmlComponent'
  },
  {
    htmlChecker: new TagChecker('lux-icon'),
    className: 'LuxIconComponent'
  },
  {
    htmlChecker: new TagChecker('lux-image'),
    className: 'LuxImageComponent'
  },
  {
    htmlChecker: new TagChecker('lux-lookup-label'),
    className: 'LuxLookupLabelComponent'
  },
  {
    htmlChecker: new TagChecker('lux-lookup-autocomplete-ac'),
    className: 'LuxLookupAutocompleteAcComponent'
  },
  {
    htmlChecker: new TagChecker('lux-lookup-combobox-ac'),
    className: 'LuxLookupComboboxAcComponent'
  },
  {
    htmlChecker: new AttributeChecker('luxRelativeTimestamp'),
    className: 'LuxRelativeTimestampPipe'
  },
  {
    htmlChecker: new AttributeChecker('luxRenderProperty'),
    className: 'LuxRenderPropertyPipe'
  },
  {
    htmlChecker: new AttributeChecker('luxPropertyFromObject'),
    className: 'LuxPropertyFromObjectPipe'
  },
  {
    htmlChecker: new AttributeChecker('luxAlphabeticallySorted'),
    className: 'LuxAlphabeticallySortedPipe'
  },
  {
    htmlChecker: new TagChecker('lux-snackbar'),
    className: 'LuxSnackbarComponent'
  },
  {
    htmlChecker: new TagChecker('lux-dialog-preset'),
    className: 'LuxDialogPresetComponent'
  },
  {
    htmlChecker: new TagChecker('lux-dialog-structure'),
    className: 'LuxDialogStructureComponent'
  },
  {
    htmlChecker: new TagChecker('lux-dialog-title'),
    className: 'LuxDialogTitleComponent'
  },
  {
    htmlChecker: new TagChecker('lux-dialog-content'),
    className: 'LuxDialogContentComponent'
  },
  {
    htmlChecker: new TagChecker('lux-dialog-actions'),
    className: 'LuxDialogActionsComponent'
  },
  {
    htmlChecker: new TagChecker('lux-tenant-logo'),
    className: 'LuxTenantLogoComponent'
  },
  {
    htmlChecker: new TagChecker('lux-tour-hint'),
    className: 'LuxTourHintComponent'
  },
  {
    htmlChecker: new TagChecker('lux-tour-hint-preset'),
    className: 'LuxTourHintPresetComponent'
  }
];

const DEFAULT_OPTIONS_PATH = './';

export function updateStandAloneimports(options: Options): Rule {
  return chain([
    messageInfoRule(`Die imports werden aktualisiert...`),
    updateStandAloneimportsIntern(options),
    messageInfoRule(`Die imports wurden aktualisiert.`)
  ]);
}

function updateStandAloneimportsIntern(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    let resolvedPath = options?.path ?? DEFAULT_OPTIONS_PATH;

    if (resolvedPath === DEFAULT_OPTIONS_PATH) {
      resolvedPath = '/';
    }

    if (!resolvedPath.startsWith('/')) {
      resolvedPath = '/' + resolvedPath;
    }

    tree.getDir(resolvedPath).visit((path, entry) => {
      if (path.endsWith('.html')) {
        const htmlPath = path;

        const tsPath = path.replace('.html', '.ts');
        if (tree.exists(tsPath)) {
          const htmlContent = readFile(tree, htmlPath);
          const tsContent = readFile(tree, tsPath);

          for (const componentInfo of componentInfos) {
            if (componentInfo.htmlChecker.test(htmlContent)) {
              addimport(tree, tsPath, options.import, componentInfo.className, false);
              addComponentimport(tree, tsPath, componentInfo.className, false);
            }
          }
        }
      } else if (path.endsWith('.ts')) {
        OLD_MODULE_NAMES.forEach((oldModuleName) => {
          removeimport(tree, path, options.import, oldModuleName);
          removeComponentimport(tree, path, oldModuleName);
        });
      }
    });
  };
}
