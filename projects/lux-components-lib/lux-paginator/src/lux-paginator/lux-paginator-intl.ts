import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class LuxPaginatorIntl extends MatPaginatorIntl {
  private tService = inject(TranslocoService);

  constructor() {
    super();
    this.updateLabels();
    this.getRangeLabel = (page, pageSize, length) => this.customRangeLabel(page, pageSize, length);

    this.tService.langChanges$.pipe(takeUntilDestroyed()).subscribe(() => {
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
    // Wenn der Startindex die Listenlänge überschreitet, wird der Endindex nicht auf das Ende gesetzt.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.tService.translate('luxc.paginator.page_part', { start: startIndex + 1, end: endIndex, length });
  }

}
