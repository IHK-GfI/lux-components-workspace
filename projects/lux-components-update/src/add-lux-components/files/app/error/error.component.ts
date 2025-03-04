import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LuxIconModule } from "../../../../../../lux-components-lib/src/lib/lux-icon/lux-icon.module";
import { LuxCardContentComponent } from "../../../../../../lux-components-lib/src/lib/lux-layout/lux-card/lux-card-subcomponents/lux-card-content.component";
import { LuxCardInfoComponent } from "../../../../../../lux-components-lib/src/lib/lux-layout/lux-card/lux-card-subcomponents/lux-card-info.component";
import { LuxCardComponent } from "../../../../../../lux-components-lib/src/lib/lux-layout/lux-card/lux-card.component";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  imports: [LuxCardComponent, LuxCardInfoComponent, LuxIconModule, LuxCardContentComponent]
})
export class ErrorComponent implements OnInit {
  private readonly router = inject(Router);

  url404 = '';

  ngOnInit(): void {
    this.url404 = this.router.routerState.snapshot.url;
  }
}
