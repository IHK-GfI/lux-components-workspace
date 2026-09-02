import { ChangeDetectionStrategy, Component, OnInit, inject, input, model } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuxCardComponent, LuxCardContentComponent } from '@ihk-gfi/lux-components';
import { ImpressumContentService } from './impressum-content.service';

@Component({
  selector: 'lux-impressum',
  templateUrl: './impressum.component.html',
  imports: [LuxCardContentComponent, LuxCardComponent],
  styles: [':host { display: flex; align-items: start; justify-content: center; flex: 1 1 auto;}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpressumComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private impressumContent = inject(ImpressumContentService);

  readonly fullWidth = input(false);
  readonly content = model<string>();

  async ngOnInit() {
    if (!this.content()) {
      this.content.set(this.route.snapshot.data['content']);
    }

    if (!this.content()) {
      this.content.set(await this.impressumContent.load());
    }

    const content = this.content();
    if (typeof content === 'string' && content.includes('<html') && content.includes('</html')) {
      this.content.set('In der lokalen Demo wird kein Impressum angezeigt.');
    }
  }
}
