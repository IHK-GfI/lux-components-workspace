export class ReplaceItem {
  public find: string | RegExp;
  public replacement: string;
  public replaceAll: boolean;

  constructor(find: string | RegExp, replace: string, replaceAll?: boolean) {
    this.find = find;
    this.replacement = replace;
    this.replaceAll = replaceAll ?? true;
  }
}

export class ReplaceHtmlTagAttributeItem extends ReplaceItem {
  constructor(tagName: string, attributeName: string, replaceName: string, replaceValue: string) {
    super(
      new RegExp(String.raw`(<${tagName}\s?[^>]*?\[?\(?)${attributeName}(\)?\]?)\s?=\s?"[^"]*"([^>]*>)`, 'gm'),
      `$1${replaceName}$2="${replaceValue}"$3`,
      true
    );
  }
}

export class RemoveHtmlTagAttributeItem extends ReplaceItem {
  constructor(tagName: string, attributeName: string) {
    super(new RegExp(String.raw`(<${tagName}\s?[^>]*?)\[?\(?${attributeName}\)?\]?\s?=\s?"[^"]*"([^>]*>)`, 'gm'), '$1$2', true);
  }
}

export class ReplaceHtmlAttributeItem extends ReplaceItem {
  constructor(attributeName: string, replace: string) {
    super(new RegExp(String.raw`(\[?\(?${attributeName}\)?\]?)\s?=\s?"[^"]*"`, 'gm'), replace, true);
  }
}

export class RemoveHtmlAttributeItem extends ReplaceItem {
  constructor(attributeName: string) {
    super(new RegExp(String.raw`(\[?\(?${attributeName}\)?\]?)\s?=\s?"[^"]*"`, 'gm'), '', true);
  }
}
