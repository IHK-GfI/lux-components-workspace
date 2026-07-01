import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import {
  LuxFormHintComponent,
  LuxImageComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-image-example',
  templateUrl: './image-example.component.html',
  styleUrls: ['./image-example.component.scss'],
  imports: [
    LuxImageComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgClass,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class ImageExampleComponent implements OnDestroy, OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  showImageFrame = false;
  imgSrcArr: string[] = [
    'assets/png/example.png',
    'assets/svg/android.svg',
    'assets/svg/Example.svg',
    'assets/svg/red_power_button.svg',
    'assets/svg/box.svg',
    '/fb/images/relative_image.png'
  ];
  imgSrc = 'assets/svg/box.svg';
  imgWidth = '50%';
  imgHeight = 'auto';
  imgRawSrc = false;
  blobImgSrc = '';

  constructor() {}

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

      this.imgSrcArr = [...this.imgSrcArr, this.blobImgSrc];
    }
  }

  ngOnDestroy(): void {
    if (this.blobImgSrc) {
      URL.revokeObjectURL(this.blobImgSrc);
    }
  }
}
