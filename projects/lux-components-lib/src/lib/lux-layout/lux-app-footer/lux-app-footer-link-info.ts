export interface ILuxAppFooterLinkInfo {
  label: string;
  path: string;
  alwaysVisible?: boolean;
  blank?: boolean;
  onClick?: (that: ILuxAppFooterLinkInfo) => void;
}

export class LuxAppFooterLinkInfo implements ILuxAppFooterLinkInfo {
  label: string;
  path: string;
  alwaysVisible: boolean;
  blank: boolean;
  onClick?: (that: ILuxAppFooterLinkInfo) => void;

  constructor(label: string, path: string, alwaysVisible?: boolean, blank?: boolean, onClick?: (that: ILuxAppFooterLinkInfo) => void) {
    this.label = label;
    this.path = path;
    this.alwaysVisible = alwaysVisible ?? false;
    this.blank = blank ?? false;
    this.onClick = onClick;
  }

  /**
   * Statische Methode um ein Info-Objekt zu generieren.
   * Nimmt ein Objekt vom Typ ILuxAppFooterLinkInfo entgegen.
   * @param data
   * @returns eine Link Info
   */
  static generateInfo(data: ILuxAppFooterLinkInfo): LuxAppFooterLinkInfo {
    return new LuxAppFooterLinkInfo(data.label, data.path, data.alwaysVisible, data.blank, data.onClick);
  }
}
