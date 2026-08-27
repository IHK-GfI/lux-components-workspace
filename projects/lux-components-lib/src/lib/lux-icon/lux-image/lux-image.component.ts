import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'lux-image',
  templateUrl: './lux-image.component.html',
  styleUrls: ['./lux-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle]
})
export class LuxImageComponent {
  private static readonly EXTERNAL_IMAGE_SRC_PREFIXES = ['http://', 'https://', 'blob:', 'data:'];

  readonly luxImageSrc = input('');
  readonly luxImageWidth = input('auto');
  readonly luxImageHeight = input('auto');
  readonly luxRawSrc = input(false);
  readonly luxAlt = input('');

  // Steuert, ob das Bild klickbar/fokussierbar dargestellt wird; explizit setzen, wenn (luxClicked) gebunden wird.
  readonly luxClickable = input(false);

  readonly luxClicked = output<Event>();
  readonly luxImageError = output<Event>();

  readonly resolvedImageSrc = computed(() => {
    const src = this.luxImageSrc();
    if (this.luxRawSrc() || !src || this.isExternalImageSrc(src)) {
      return src;
    }

    const prefixed = src.indexOf('asset') === -1 ? 'assets/' + src : src;
    return this.sanitizeImageSrc(prefixed);
  });

  clicked(event: Event) {
    this.luxClicked.emit(event);
  }

  protected onImageError(event: Event) {
    this.luxImageError.emit(event);
  }

  private isExternalImageSrc(src: string): boolean {
    const normalizedImageSrc = src.toLowerCase();

    return src.startsWith('//') || LuxImageComponent.EXTERNAL_IMAGE_SRC_PREFIXES.some((prefix) => normalizedImageSrc.startsWith(prefix));
  }

  private sanitizeImageSrc(src: string): string {
    // Doppelte Slashes entfernen
    let sanitized = src.replace(/\/\/+/g, '/');
    // Führende Slashes entfernen
    if (sanitized.startsWith('/')) {
      sanitized = sanitized.slice(1);
    }
    return sanitized;
  }
}
