import { isPlatformBrowser, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {
  LuxFormHintComponent,
  LuxImageComponent,
  LuxInputComponent,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-image-example',
  templateUrl: './image-example.component.html',
  styleUrls: ['./image-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxImageComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgClass,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class ImageExampleComponent implements OnDestroy, OnInit {
  readonly showImageFrame = signal(false);
  readonly imgSrcArr = signal<string[]>([
    'assets/png/example.png',
    'assets/svg/android.svg',
    'assets/svg/Example.svg',
    'assets/svg/red_power_button.svg',
    'assets/svg/box.svg',
    '/fb/images/relative_image.png'
  ]);
  readonly imgSrc = signal('assets/svg/box.svg');
  readonly imgWidth = signal('50%');
  readonly imgHeight = signal('auto');
  readonly imgRawSrc = signal(false);
  blobImgSrc = '';

  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.blobImgSrc = URL.createObjectURL(
        new Blob(
          [
            `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120" viewBox="0 0 240 120">
              <rect width="240" height="120" rx="16" fill="#00549f" />
              <circle cx="58" cy="60" r="28" fill="#ffffff" />
              <path d="M110 38h88v12h-88zm0 22h66v12h-66zm0 22h88v12h-88z" fill="#ffffff" />
            </svg>`
          ],
          { type: 'image/svg+xml' }
        )
      );

      this.imgSrcArr.update((arr) => [...arr, this.blobImgSrc]);
    }
  }

  ngOnDestroy(): void {
    if (this.blobImgSrc) {
      URL.revokeObjectURL(this.blobImgSrc);
    }
  }
}
