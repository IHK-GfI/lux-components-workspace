import { Directive, inject, TemplateRef } from '@angular/core';

export interface LuxListSelectContentContext<T> {
  $implicit: T;
  selected: boolean;
}

export interface LuxListSelectActionContext<T> {
  $implicit: T;
}

/** Markiert das ng-template, das den Karteninhalt (Titel/Untertitel) ersetzt. Kontext: Item als `let-item`, Auswahlstatus als `let-selected="selected"`. */
@Directive({ selector: 'ng-template[luxListSelectContent]' })
export class LuxListSelectContentDirective<T = unknown> {
  readonly templateRef = inject<TemplateRef<LuxListSelectContentContext<T>>>(TemplateRef);

  // any statt T: der Item-Typ lässt sich aus dem Template nicht herleiten, `let-item` soll ohne Cast nutzbar bleiben.
  static ngTemplateContextGuard(_dir: LuxListSelectContentDirective, ctx: unknown): ctx is LuxListSelectContentContext<any> {
    return true;
  }
}

/** Markiert das ng-template für die Aktion je Karte (z.B. Icon-Button oder lux-menu); Position über `luxActionPosition`. Kontext: Item als `let-item`. */
@Directive({ selector: 'ng-template[luxListSelectAction]' })
export class LuxListSelectActionDirective<T = unknown> {
  readonly templateRef = inject<TemplateRef<LuxListSelectActionContext<T>>>(TemplateRef);

  static ngTemplateContextGuard(_dir: LuxListSelectActionDirective, ctx: unknown): ctx is LuxListSelectActionContext<any> {
    return true;
  }
}
