import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lux-chat-ai-json-viewer',
  standalone: true,
  imports: [CommonModule, LuxChatAiJsonViewerComponent],
  templateUrl: './lux-chat-ai-json-viewer.component.html'
})
export class LuxChatAiJsonViewerComponent {
  @Input() data: unknown;
  @Input() key?: string;
  @Input() depth = 0;
  collapsable = input(true);

  get isArray(): boolean {
    return Array.isArray(this.data);
  }

  get isObject(): boolean {
    return this.data !== null && typeof this.data === 'object' && !Array.isArray(this.data);
  }

  get isPrimitive(): boolean {
    return !this.isArray && !this.isObject;
  }

  get objectEntries(): { key: string; value: unknown }[] {
    if (this.isObject) {
      return Object.entries(this.data as Record<string, unknown>).map(([k, v]) => ({ key: k, value: v }));
    }
    return [];
  }

  get arrayItems(): { index: number; value: unknown }[] {
    if (this.isArray) {
      return (this.data as unknown[]).map((value, index) => ({ index, value }));
    }
    return [];
  }

  get dataLength(): number {
    if (this.isArray) return (this.data as unknown[]).length;
    if (this.isObject) return Object.keys(this.data as object).length;
    return 0;
  }

  isComplex(value: unknown): boolean {
    return value !== null && typeof value === 'object';
  }

  primitiveClass(value: unknown): string {
    if (value === null) return 'json-null';
    if (typeof value === 'string') return 'json-string';
    if (typeof value === 'number') return 'json-number';
    if (typeof value === 'boolean') return 'json-boolean';
    return 'json-unknown';
  }

  formatValue(value: unknown): string {
    if (value === null) return 'null';
    else if (typeof value === 'string') return `"${value}"`;
    return '';
  }
}
