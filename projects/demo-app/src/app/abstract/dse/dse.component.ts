import { ChangeDetectionStrategy, Component, OnInit, inject, input, model } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuxCardComponent, LuxCardContentComponent } from '@ihk-gfi/lux-components';
import { DseContentService } from './dse-content.service';

@Component({
  selector: 'lux-dse',
  templateUrl: './dse.component.html',
  imports: [LuxCardContentComponent, LuxCardComponent],
  styles: [':host { display: flex; align-items: start; justify-content: center; flex: 1 1 auto;}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DseComponent implements OnInit {
  readonly fullWidth = input(false);
  readonly content = model<string>();

  private route = inject(ActivatedRoute);
  private dseContent = inject(DseContentService);

  async ngOnInit() {
    if (!this.content()) {
      this.content.set(this.route.snapshot.data['content']);
    }

    if (!this.content()) {
      this.content.set(await this.dseContent.load());
    }

    const content = this.content();
    if (typeof content === 'string' && content.includes('<html') && content.includes('</html')) {
      this.content.set('In der lokalen Demo wird kein Datenschutzhinweis angezeigt.');
    }
  }
}
