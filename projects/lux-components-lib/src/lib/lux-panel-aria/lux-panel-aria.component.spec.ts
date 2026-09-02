// import { Component } from '@angular/core';
// import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { LuxPanelAriaComponent } from './lux-panel-aria.component';
// import { LuxPanelAriaContentComponent } from './lux-panel-aria-subcomponents/lux-panel-aria-content.component';
// import { LuxPanelAriaHeaderCustomComponent } from './lux-panel-aria-subcomponents/lux-panel-aria-header-custom.component';
// import { LuxPanelAriaHeaderTitleComponent } from './lux-panel-aria-subcomponents/lux-panel-aria-header-title.component';

// describe('LuxPanelAriaComponent', () => {
//   let fixture: ComponentFixture<LuxPanelAriaTestComponent>;
//   let testComponent: LuxPanelAriaTestComponent;

//   beforeEach(fakeAsync(() => {
//     TestBed.configureTestingModule({
//       imports: [LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent, LuxPanelAriaContentComponent, LuxPanelAriaTestComponent]
//     });

//     fixture = TestBed.createComponent(LuxPanelAriaTestComponent);
//     fixture.detectChanges();
//     testComponent = fixture.componentInstance;
//     tick();
//     fixture.detectChanges();
//   }));

//   it('sollte erstellt werden', () => {
//     expect(testComponent).toBeTruthy();
//   });

//   it('sollte initial kollabiert sein', () => {
//     const content = fixture.debugElement.query(By.css('.lux-expansion-panel-content'));
//     expect(content).toBeNull();
//     const panel = fixture.debugElement.query(By.css('[ngAccordionPanel]'));
//     expect(panel.nativeElement.getAttribute('role')).toBe('region');
//     expect(panel.nativeElement.hasAttribute('inert')).toBeTrue();
//   });

//   it('sollte Panel-Inhalt nach dem Öffnen anzeigen', fakeAsync(() => {
//     const headerButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));

//     headerButton.nativeElement.click();
//     fixture.detectChanges();
//     tick();
//     flush();
//     fixture.detectChanges();

//     const content = fixture.debugElement.query(By.css('.lux-expansion-panel-content'));
//     expect(content).toBeTruthy();
//     expect(fixture.debugElement.query(By.css('[ngAccordionPanel]')).nativeElement.hasAttribute('inert')).toBeFalse();
//     expect(content.nativeElement.textContent).toContain('Content');
//   }));

//   it('sollte bei Header-Klick expandieren und schließen', fakeAsync(() => {
//     const headerButton = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));

//     headerButton.nativeElement.click();
//     fixture.detectChanges();
//     tick();

//     expect(testComponent.expandedEvents).toContain(true);

//     headerButton.nativeElement.click();
//     fixture.detectChanges();
//     tick();

//     expect(testComponent.expandedEvents).toContain(false);
//   }));

//   it('sollte Toggle-Position before rendern', fakeAsync(() => {
//     testComponent.togglePosition = 'before';
//     fixture.detectChanges();
//     tick();

//     const header = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
//     expect(header.nativeElement.classList.contains('mat-expansion-toggle-indicator-before')).toBeTrue();
//   }));

//   it('sollte deaktiviertes Panel nicht öffnen', fakeAsync(() => {
//     testComponent.disabled = true;
//     fixture.detectChanges();
//     tick();

//     const header = fixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
//     header.nativeElement.click();
//     fixture.detectChanges();
//     tick();

//     const content = fixture.debugElement.query(By.css('.lux-expansion-panel-content'));
//     expect(header.nativeElement.getAttribute('aria-disabled')).toBe('true');
//     expect(content).toBeNull();
//   }));

//   it('sollte auch nicht-geslotteten Inhalt im Content-Bereich anzeigen', fakeAsync(() => {
//     const plainFixture = TestBed.createComponent(LuxPanelAriaPlainContentTestComponent);
//     plainFixture.detectChanges();
//     tick();
//     flush();
//     plainFixture.detectChanges();

//     const headerButton = plainFixture.debugElement.query(By.css('.lux-expansion-panel-header-toggle'));
//     headerButton.nativeElement.click();
//     plainFixture.detectChanges();
//     tick();

//     const content = plainFixture.debugElement.query(By.css('.lux-expansion-panel-content'));
//     expect(content).toBeTruthy();
//     expect(content.nativeElement.textContent).toContain('Fallback Content');
//   }));
// });

// @Component({
//   selector: 'lux-panel-aria-test',
//   standalone: true,
//   imports: [LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent, LuxPanelAriaContentComponent],
//   template: `
//     <lux-accordion-aria>
//       <lux-panel-aria
//         [luxExpanded]="expanded"
//         [luxDisabled]="disabled"
//         [luxTogglePosition]="togglePosition"
//         (luxExpandedChange)="expandedEvents.push($event)"
//       >
//         <lux-panel-aria-header-title>Titel</lux-panel-aria-header-title>
//         <lux-panel-aria-content>Content</lux-panel-aria-content>
//       </lux-panel-aria>
//     </lux-accordion-aria>
//   `
// })
// class LuxPanelAriaTestComponent {
//   expanded = false;
//   disabled = false;
//   togglePosition: 'before' | 'after' = 'after';
//   expandedEvents: boolean[] = [];
// }

// @Component({
//   selector: 'lux-panel-aria-plain-content-test',
//   standalone: true,
//   imports: [LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent],
//   template: `
//     <lux-accordion-aria>
//       <lux-panel-aria>
//         <lux-panel-aria-header-title>Titel</lux-panel-aria-header-title>
//         <p>Fallback Content</p>
//       </lux-panel-aria>
//     </lux-accordion-aria>
//   `
// })
// class LuxPanelAriaPlainContentTestComponent {}

// @Component({
//   selector: 'lux-panel-aria-custom-header-test',
//   standalone: true,
//   imports: [LuxPanelAriaComponent, LuxPanelAriaHeaderTitleComponent, LuxPanelAriaHeaderCustomComponent, LuxPanelAriaContentComponent],
//   template: `
//     <lux-accordion-aria>
//       <lux-panel-aria [luxTogglePosition]="'after'">
//         <lux-panel-aria-header-title>Titel</lux-panel-aria-header-title>
//         <lux-panel-aria-header-custom>
//           <button type="button">Aktion</button>
//         </lux-panel-aria-header-custom>
//         <lux-panel-aria-content>Content</lux-panel-aria-content>
//       </lux-panel-aria>
//     </lux-accordion-aria>
//   `
// })
// class LuxPanelAriaCustomHeaderTestComponent {}
