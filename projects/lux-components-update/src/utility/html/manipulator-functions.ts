import { replaceAll, replaceFirst } from '../util';
import { Hit } from './hit';

/**
 * @typedef ManipulatorFn Eine Manipulator-Funktion transformiert den HTML-Inhalt eines {@link Element}s.
 */
export declare type ManipulatorFn = (hit: Hit) => void;

/**
 * Diese Funktion fügt dem Element ein neues Attribut hinzu. Das neue Attribut wird direkt hinter dem Tag als erstes Attribut hinzugefügt.
 *
 * @example Neues Attribut "luxHint"
 * Input:  <lux-input luxLabel="Lorem ipsum"></lux-input>
 * Output: <lux-input luxHint="Hint" luxLabel="Lorem ipsum"></lux-input>
 *
 * @param name Ein Attributname.
 * @param value Ein Attributwert.
 */
export const addAttrFn = (name: string, value: string) => {
  return (hit: Hit) => {
    hit.elementContent = replaceFirst(hit.elementContent, `<${hit.selector}`, `<${hit.selector} ${name}="${value}"`);
  };
};

/**
 * Diese Funktion löscht das gesamte Element.
 *
 * @example
 * Input: <lux-input luxLabel="Lorem ipsum"></lux-input>
 * Output:
 *
 * @param hit Ein {@link Hit}.
 */
export const removeElementFn = (hit: Hit) => {
  hit.elementContent = '';
};

/**
 * Diese Funktion benennt das Element um.
 *
 * @example Neuer Name "lux-input-ac"
 * Input:  <lux-input luxLabel="Lorem ipsum"></lux-input>
 * Output: <lux-input-ac luxLabel="Lorem ipsum"></lux-input-ac>
 *
 * @param newName Der neue Name.
 */
export const renameElementFn = (newName: string) => {
  return (hit: Hit) => {
    hit.elementContent = replaceAll(hit.elementContent, `<${hit.selector}>`, `<${newName}>`);
    hit.elementContent = replaceAll(hit.elementContent, `<${hit.selector} `, `<${newName} `);
    hit.elementContent = replaceAll(hit.elementContent, `<${hit.selector}\n`, `<${newName}\n`);
    hit.elementContent = replaceAll(hit.elementContent, `</${hit.selector}>`, `</${newName}>`);
    hit.elementContent = replaceAll(hit.elementContent, `</${hit.selector} `, `</${newName} `);
    hit.elementContent = replaceAll(hit.elementContent, `<${hit.selector}\n`, `<${newName}\n`);
  };
};

/**
 * Diese Funktion benennt ein Attribut um.
 *
 * @example Alter Name "luxSelectedFiles", neuer Name "luxSelected"
 * Input:  <lux-file-list (luxSelectedFiles)="..."></lux-file-list>
 * Output: <lux-file-list (luxSelected)="..."></lux-file-list>
 *
 * @param oldName Ein alter Name.
 * @param newName Ein neuer Name.
 */
export const renameAttrFn = (oldName: string, newName: string) => {
  return (hit: Hit) => {
    const pattern = new RegExp('((\\(|\\[|\\[\\()?)' + oldName + '((\\)|\\]|\\)\\])?)\\s*=\\s*"(.*?)"', 'm');
    hit.elementContent = hit.elementContent.replace(pattern, '$1' + newName + '$3="$5"');
  };
};

/**
 * Diese Funktion aktualisiert den Attributwert nur, wenn dieser mit dem alten Wert übereinstimmt.
 *
 * @example Name "luxLabel", alter Wert "Vorname" und neuer Wert "Name" (alter Wert stimmt überein und der neue Wert wird gesetzt)
 * Input:  <lux-input luxLabel="Vorname"></lux-input>
 * Output: <lux-input luxLabel="Name"></lux-input>
 *
 * @example Name "luxLabel", alter Wert "Name" und neuer Wert "Nachname" (alter Wert stimmt nicht überein und der HTML-Inhalt bleibt unverändert)
 * Input:  <lux-input luxLabel="Vorname"></lux-input>
 * Output: <lux-input luxLabel="Vorname"></lux-input>
 *
 * @param name Ein Attributname.
 * @param oldValue Ein alter Attributwert.
 * @param newValue Ein neuer Attributwert.
 */
export const updateAttrIfFn = (name: string, oldValue: string, newValue: string) => {
  return (hit: Hit) => {
    const pattern = new RegExp('((\\(|\\[|\\[\\()?' + name + '(\\)|\\]|\\)\\])?)\\s*=\\s*"(' + oldValue + ')"', 'm');
    hit.elementContent = hit.elementContent.replace(pattern, '$1="' + newValue + '"');
  };
};

/**
 * Diese Funktion aktualisiert den Attributwert, wenn es das Attribut gibt. D.h. wenn es das Attribut nicht gibt, wird es auch nicht angelegt.
 *
 * @example Name "luxLabel", Wert "Vorname" (Attribut vorhanden und der Wert wird gesetzt)
 * Input:  <lux-input luxLabel="Name"></lux-input>
 * Output: <lux-input luxLabel="Vorname"></lux-input>
 *
 * @example Name "luxLabel", Wert "Vorname" (Attribut nicht vorhanden und der HTML-Inhalt bleibt unverändert)
 * Input:  <lux-input></lux-input>
 * Output: <lux-input></lux-input>
 *
 * @param name Ein Attributname.
 * @param value Ein Attributwert.
 */
export const updateAttrFn = (name: string, value: string) => {
  return (hit: Hit) => {
    const pattern = new RegExp('((\\(|\\[|\\[\\()?' + name + '(\\)|\\]|\\)\\])?)\\s*=\\s*"(.*?)"', 'm');
    hit.elementContent = hit.elementContent.replace(pattern, '$1="' + value + '"');
  };
};

/**
 * Diese Funktion hängt den Wert hinten an, wenn es das Attribut gibt.
 *
 * @example Name "luxLabel", Wert " (*)"
 * Input:  <lux-input luxLabel="Nachname"></lux-input>
 * Output: <lux-input luxLabel="Nachname (*)"></lux-input>
 *
 * @param name Ein Attributname.
 * @param appendValue Ein anzuhängender Wert.
 */
export const appendAttrFn = (name: string, appendValue: string) => {
  return (hit: Hit) => {
    const pattern = new RegExp('((\\(|\\[|\\[\\()?' + name + '(\\)|\\]|\\)\\])?)\\s*=\\s*"(.*?)"', 'm');
    hit.elementContent = hit.elementContent.replace(pattern, '$1="$4' + appendValue + '"');
  };
};

/**
 * Diese Funktion löscht ein Attribut.
 *
 * @example Attribut "luxHint"
 * Input:  <lux-input luxLabel="Name" luxHint="Lorem ipsum"></lux-input>
 * Output: <lux-input luxLabel="Name"></lux-input>
 *
 * @param name Ein Attributname.
 */
export const removeAttrFn = (name: string) => {
  return (hit: Hit) => {
    const pattern = new RegExp('(\\(|\\[|\\[\\()?' + name + '(\\)|\\]|\\)\\])?\\s*=\\s*"(.*?)"', 'm');
    hit.elementContent = hit.elementContent.replace(pattern, '');
  };
};
