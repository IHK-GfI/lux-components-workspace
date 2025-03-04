import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as chalk from 'chalk';
import { updateDependencies } from '../../update-dependencies/index';
import { replaceRule } from '../../utility/files';
import { logInfoWithDescriptor, logSuccess } from '../../utility/logging';
import { RemoveHtmlAttributeItem, RemoveHtmlTagAttributeItem, ReplaceItem } from '../../utility/replace-item';
import { applyRuleIf, finish, messageInfoRule, messageSuccessRule } from '../../utility/util';
import { validateLuxComponentsVersion, validateNodeVersion } from '../../utility/validation';

export const updateMajorVersion = '18';
export const updateMinVersion = '16.6.0';
export const updateNodeMinVersion = '18.0.0';

export function update180000(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      check(options),
      applyRuleIf(updateMinVersion, updateProject(options)),
      finish(
        false,
        ``,
        `${chalk.yellowBright('Nur für JAST-Apps')}`,
        `${chalk.yellowBright('----------------------------------------------------------------------')}`,
        `${chalk.yellowBright('1. Bitte die Node-Version 22 verwenden.')}`,
        `${chalk.yellowBright('2. Bitte die pipeline.yaml anpassen:')}`,
        `${chalk.yellowBright('   a. Den Parameter --no-optional entfernen.')}`,
        `${chalk.yellowBright('   b. Das Image von "node:18-alpine" auf "node:22-alpine" ändern.')}`,
        ``,
        `${chalk.greenBright('Fertig!')}`
      )
    ]);
  };
}

export function updateProject(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`LUX-Components ${updateMajorVersion} werden aktualisiert...`),
      updateDependencies(),
      updateFormControls(options),
      updateTabs(options),
      updateChips(options),
      updateSlider(options),
      updateAngularJson(options),
      updateStylesScss(options),
      updateStylesCss(options),
      messageSuccessRule(`LUX-Components ${updateMajorVersion} wurden aktualisiert.`)
    ]);
  };
}

function check(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    logInfoWithDescriptor(`Vorbedingungen werden geprüft...`);

    validateNodeVersion(_context, updateNodeMinVersion);
    validateLuxComponentsVersion(tree, `${updateMinVersion} || ^${updateMajorVersion}.0.0`);

    logSuccess(`Vorbedingungen wurden geprüft.`);

    return tree;
  };
}

export function updateFormControls(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`FormControls werden angepasst...`),
      replaceRule(
        options,
        'Attribut "luxOptionMultiline" wird entfernt...',
        'Attribut "luxOptionMultiline" wurde entfernt.',
        '.html',
        new RemoveHtmlAttributeItem('luxOptionMultiline')
      ),
      messageSuccessRule(`FormControls wurden angepasst.`)
    ]);
  };
}

export function updateTabs(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Tabs werden angepasst...`),
      replaceRule(
        options,
        'Attribut "luxTabAnimationActive" wird entfernt...',
        'Attribut "luxTabAnimationActive" wurde entfernt.',
        '.html',
        new RemoveHtmlTagAttributeItem('lux-tabs', 'luxTabAnimationActive')
      ),
      messageSuccessRule(`Tabs wurden angepasst.`)
    ]);
  };
}

export function updateChips(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Chips werden angepasst...`),
      replaceRule(
        options,
        'Attribut "luxMultiple" wird entfernt...',
        'Attribut "luxMultiple" wurde entfernt.',
        '.html',
        new RemoveHtmlTagAttributeItem('lux-chips-ac', 'luxMultiple')
      ),
      replaceRule(
        options,
        'Attribut "luxSelected" wird entfernt...',
        'Attribut "luxSelected" wurde entfernt.',
        '.html',
        new RemoveHtmlTagAttributeItem('lux-chip-ac-group', 'luxSelected')
      ),
      replaceRule(
        options,
        'Attribut "luxChipSelected" wird entfernt...',
        'Attribut "luxChipSelected" wurde entfernt.',
        '.html',
        new RemoveHtmlTagAttributeItem('lux-chip-ac-group', 'luxChipSelected')
      ),
      messageSuccessRule(`Chips wurden angepasst.`)
    ]);
  };
}

export function updateSlider(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`Slider werden angepasst...`),
      replaceRule(
        options,
        'Attribut "luxShowThumbLabelAlways" wird entfernt...',
        'Attribut "luxShowThumbLabelAlways" wurde entfernt.',
        '.html',
        new RemoveHtmlTagAttributeItem('lux-slider-ac', 'luxShowThumbLabelAlways')
      ),
      replaceRule(
        options,
        'Attribut "luxVertical" wird entfernt...',
        'Attribut "luxVertical" wurde entfernt.',
        '.html',
        new RemoveHtmlTagAttributeItem('lux-slider-ac', 'luxVertical')
      ),
      replaceRule(
        options,
        'Attribut "luxInvert" wird entfernt...',
        'Attribut "luxInvert" wurde entfernt.',
        '.html',
        new RemoveHtmlTagAttributeItem('lux-slider-ac', 'luxInvert')
      ),
      replaceRule(
        options,
        'Attribut "luxTickInterval" wird entfernt...',
        'Attribut "luxTickInterval" wurde entfernt.',
        '.html',
        new RemoveHtmlTagAttributeItem('lux-slider-ac', 'luxTickInterval')
      ),
      messageSuccessRule(`Slider wurden angepasst.`)
    ]);
  };
}

export function updateAngularJson(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`angular.json wird angepasst...`),
      replaceRule(
        options,
        'Attribut "browserTarget" wird umbenannt in "buildTarget"...',
        'Attribut "luxOptionMultiline" wurde entfernt.',
        'angular.json',
        new ReplaceItem('browserTarget', 'buildTarget', true)
      ),
      messageSuccessRule(`angular.json wurde angepasst.`)
    ]);
  };
}

export function updateStylesScss(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`styles.scss wird angepasst...`),
      replaceRule(
        options,
        'import wird geprüft...',
        'import wurde geprüft.',
        'styles.scss',
        new ReplaceItem(`@import '@ihk-gfi`, `@import '../node_modules/@ihk-gfi`, true),
        new ReplaceItem(`@import "@ihk-gfi`, `@import "../node_modules/@ihk-gfi`, true)
      ),
      messageSuccessRule(`styles.scss wurde angepasst.`)
    ]);
  };
}

export function updateStylesCss(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      messageInfoRule(`styles.css wird angepasst...`),
      replaceRule(
        options,
        'import wird geprüft...',
        'import wurde geprüft.',
        'styles.css',
        new ReplaceItem(`@import '@ihk-gfi`, `@import '../node_modules/@ihk-gfi`, true),
        new ReplaceItem(`@import "@ihk-gfi`, `@import "../node_modules/@ihk-gfi`, true)
      ),
      messageSuccessRule(`styles.css wurde angepasst.`)
    ]);
  };
}
