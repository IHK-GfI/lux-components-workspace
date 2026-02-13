import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'lux-select-panel-filter',
  templateUrl: './lux-select-panel-filter.component.html',
  styleUrls: ['./lux-select-panel-filter.component.scss']
})
export class LuxSelectPanelFilterComponent {
  @Input() placeholder = 'Filter';
  @Input() filterValue = '';

  @Output() filterChange = new EventEmitter<string>();
  @Output() escapePressed = new EventEmitter<KeyboardEvent>();
  @Output() arrowKeyPressed = new EventEmitter<KeyboardEvent>();

  @ViewChild('filterInput', { read: ElementRef }) filterInput?: ElementRef<HTMLInputElement>;

  onInput(event: Event): void {
    this.filterChange.emit((event.target as HTMLInputElement).value);
  }

  onKeydown(event: KeyboardEvent): void {
    event.stopPropagation();

    if (event.key === 'Escape') {
      this.escapePressed.emit(event);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
      this.arrowKeyPressed.emit(event);
    }
  }

  stopPanelEvent(event: Event): void {
    event.stopPropagation();
  }
}
