import { signal } from '@angular/core';
import { ResponsiveBehaviour } from './responsive-behaviour';

interface ColumnConfigInit {
  label?: string;
  sortable?: boolean;
  sticky?: boolean;
  responsiveAt?: string | string[] | null;
  responsiveBehaviour?: ResponsiveBehaviour;
}

export class ColumnConfig {
  label = '';
  sortable = true;
  sticky = false;

  // Als Signal abgelegt, damit Änderungen (u.a. der verzögerte setTimeout-Fallback unten) auch dann erkannt werden,
  // wenn diese Konfiguration von einer anderen (OnPush-)Komponente als der aufrufenden gelesen wird.
  private readonly _responsiveAt = signal<string | string[] | null>(null);
  private readonly _responsiveBehaviour = signal<ResponsiveBehaviour>(ResponsiveBehaviour.NOT_RESPONSIVE);

  constructor(partial: ColumnConfigInit) {
    if (partial.label !== undefined) {
      this.label = partial.label;
    }
    if (partial.sortable !== undefined) {
      this.sortable = partial.sortable;
    }
    if (partial.sticky !== undefined) {
      this.sticky = partial.sticky;
    }
    if (partial.responsiveAt !== undefined) {
      this._responsiveAt.set(partial.responsiveAt);
    }
    if (partial.responsiveBehaviour !== undefined) {
      this.responsiveBehaviour = partial.responsiveBehaviour;
    }
  }

  get responsiveAt() {
    return this._responsiveAt();
  }

  set responsiveAt(responsiveAt: string | string[] | null) {
    this._responsiveAt.set(responsiveAt);
  }

  get responsiveBehaviour() {
    return this._responsiveBehaviour();
  }

  set responsiveBehaviour(behaviour: ResponsiveBehaviour) {
    this._responsiveBehaviour.set(behaviour);

    if (behaviour.value === null) {
      this.responsiveAt = null;
    } else if (this.responsiveAt === null || this.responsiveAt.length === 0) {
      setTimeout(() => {
        this.responsiveAt = ['xs', 'sm'];
      });
    }
  }
}
