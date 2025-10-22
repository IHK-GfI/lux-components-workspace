import { inject, Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

@Injectable()
export class LuxPaginatorIntl extends MatPaginatorIntl implements OnDestroy {

  private tService = inject(TranslocoService);
  private langSub?: Subscription;

  constructor() {
    super();
    this.updateLabels();
    this.getRangeLabel = this.customRangeLabel;

    // Bei Sprachwechsel Labels aktualisieren
    this.langSub = this.tService.langChanges$.subscribe(() => {
      this.updateLabels();
      this.changes.next();
    });
  }

  private updateLabels() {
    this.itemsPerPageLabel = this.tService.translate('luxc.paginator.elements_on_page');
    this.nextPageLabel = this.tService.translate('luxc.paginator.next_page');
    this.previousPageLabel = this.tService.translate('luxc.paginator.previous_page');
    this.lastPageLabel = this.tService.translate('luxc.paginator.last_page');
    this.firstPageLabel = this.tService.translate('luxc.paginator.first_page');
  }

  /**
   * Deutsche Fassung des Material-Paginators
   * @param page
   * @param pageSize
   * @param length
   */
  private customRangeLabel(page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) {
      return this.tService.translate('luxc.paginator.0_until_length', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.tService.translate('luxc.paginator.page_part', { start: startIndex + 1, end: endIndex, length });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }
}
