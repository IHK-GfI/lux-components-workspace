import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { LuxFormHintComponent, LuxInputComponent, LuxTextareaComponent, LuxToggleComponent } from '@ihk-gfi/lux-components';
import { LuxSanitizeConfig } from '@ihk-gfi/lux-components/lux-html';
import { LuxMarkdownComponent } from '@ihk-gfi/lux-components/lux-markdown';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'lux-markdown-example',
  templateUrl: './markdown-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxTextareaComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    LuxMarkdownComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class MarkdownExampleComponent {
  readonly style = signal('');
  readonly class = signal('');

  readonly sanitizeConfig = signal<LuxSanitizeConfig | undefined>(undefined);

  readonly forbiddenTags = signal('a,b');
  readonly forbiddenAttributes = signal('style,class');

  readonly allowedTags = signal('h1,p,span');
  readonly allowedAttributes = signal('class,style');

  readonly addAllowedTags = signal('');
  readonly addAllowedAttributes = signal('target');

  readonly markdownData = signal(`# Title
## Subtitle
Show doch mal bei der [IHK-GfI](https://www.ihk-gfi.de) vorbei!

Hier ist noch einmal der LinK <a href="https://www.ihk-gfi.de" target="_blank">IHK-GfI</a> aber diesen Mal mit
Target-Attribut. Das Target-Attribut ist im Standard deaktiviert, kann über den Tab "Erweitert" aktiviert werden.

### Tabelle

| Name | Version | Beschreibung |
| --- | --- | --- |
| Lorem ipsum | dolor sit amet | consetetur sadipscing elitr |
| sed diam | nonumy eirmod tempor | invidunt ut labore et dolore magna aliquyam |

### Aufzählung
1. A
1. B
 1. B1
 1. B2
1. C

- A
- B
 - B1
 - B2
- C`);

  private readonly _forbiddenTagsToggle = signal(false);
  private readonly _allowedTagsToggle = signal(false);
  private readonly _addAllowedTagsToggle = signal(false);

  set forbiddenTagsToggle(toggle: boolean) {
    this._forbiddenTagsToggle.set(toggle);

    if (toggle) {
      this._allowedTagsToggle.set(false);
      this._addAllowedTagsToggle.set(false);
    }
    this.updateTags();
  }

  get forbiddenTagsToggle() {
    return this._forbiddenTagsToggle();
  }

  set allowedTagsToggle(toggle: boolean) {
    this._allowedTagsToggle.set(toggle);

    if (toggle) {
      this._forbiddenTagsToggle.set(false);
      this._addAllowedTagsToggle.set(false);
    }
    this.updateTags();
  }

  get allowedTagsToggle() {
    return this._allowedTagsToggle();
  }

  set addAllowedTagsToggle(toggle: boolean) {
    this._addAllowedTagsToggle.set(toggle);

    if (toggle) {
      this._forbiddenTagsToggle.set(false);
      this._allowedTagsToggle.set(false);
    }
    this.updateTags();
  }

  get addAllowedTagsToggle() {
    return this._addAllowedTagsToggle();
  }

  updateTags() {
    const newConfig: LuxSanitizeConfig = {};
    if (this.forbiddenTagsToggle) {
      newConfig.forbiddenTags = this.forbiddenTags().split(',');
      newConfig.forbiddenAttrs = this.forbiddenAttributes().split(',');
    }

    if (this.allowedTagsToggle) {
      newConfig.allowedTags = this.allowedTags().split(',');
      newConfig.allowedAttrs = this.allowedAttributes().split(',');
    }

    if (this.addAllowedTagsToggle) {
      newConfig.addAllowedTags = this.addAllowedTags().split(',');
      newConfig.addAllowedAttrs = this.addAllowedAttributes().split(',');
    }

    if (JSON.stringify(this.sanitizeConfig()) !== JSON.stringify(newConfig)) {
      this.sanitizeConfig.set(newConfig);
      console.log(this.sanitizeConfig());
    }
  }
}
