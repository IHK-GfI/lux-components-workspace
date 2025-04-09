import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
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
export class ImageExampleComponent {
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

  constructor() {}
}
