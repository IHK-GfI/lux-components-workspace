import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuxCardComponent, LuxCardContentComponent } from 'lux-components-lib';

@Component({
  selector: 'lux-impressum',
  templateUrl: './impressum.component.html',
  imports: [LuxCardContentComponent, LuxCardComponent],
  styles: [':host { display: flex; align-items: start; justify-content: center; flex: 1 1 auto;}'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpressumComponent implements OnInit {
  private route = inject(ActivatedRoute);

  public content?: string;

  ngOnInit() {
    this.content = this.route.snapshot.data['content'];

    if (typeof this.content === 'string' && this.content.includes('<html') && this.content.includes('</html')) {
      this.content = 'In der lokalen Demo wird kein Impressum angezeigt.';
    }
  }
}
