import { describe, it, expect } from 'vitest';
import { ChangeDetectionStrategy, Component, output, signal, viewChild } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { luxOutputObserved } from './lux-output-observed';

describe('luxOutputObserved', () => {
  it('Sollte ohne Listener false liefern', () => {
    const fixture = TestBed.createComponent(UnboundHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.child().observed()).toBe(false);
    expect(fixture.debugElement.query(By.css('.observed'))).toBeNull();
  });

  it('Sollte mit Template-Listener bereits beim ersten Rendern true liefern', () => {
    const fixture = TestBed.createComponent(BoundHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.child()!.observed()).toBe(true);
    expect(fixture.debugElement.query(By.css('.observed'))).not.toBeNull();
  });

  it('Sollte ein bedingt gerendertes Kind (OnPush) beim ersten Rendern korrekt darstellen', () => {
    const fixture = TestBed.createComponent(BoundHostComponent);
    fixture.componentInstance.show.set(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.observed'))).toBeNull();

    fixture.componentInstance.show.set(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.observed'))).not.toBeNull();
  });

  it('Sollte den Listener weiterhin aufrufen', () => {
    const fixture = TestBed.createComponent(BoundHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.child()!.out.emit('test');

    expect(fixture.componentInstance.received).toEqual(['test']);
  });

  it('Sollte manuelle Subscriptions zählen und nach unsubscribe wieder false liefern', () => {
    const fixture = TestBed.createComponent(UnboundHostComponent);
    fixture.detectChanges();
    const child = fixture.componentInstance.child();

    const sub1 = child.out.subscribe(() => {});
    const sub2 = child.out.subscribe(() => {});
    fixture.detectChanges();
    expect(child.observed()).toBe(true);
    expect(fixture.debugElement.query(By.css('.observed'))).not.toBeNull();

    sub1.unsubscribe();
    expect(child.observed()).toBe(true);

    sub2.unsubscribe();
    fixture.detectChanges();
    expect(child.observed()).toBe(false);
    expect(fixture.debugElement.query(By.css('.observed'))).toBeNull();
  });

  it('Sollte bei mehrfachem unsubscribe nicht unter 0 zählen', () => {
    const fixture = TestBed.createComponent(UnboundHostComponent);
    fixture.detectChanges();
    const child = fixture.componentInstance.child();

    const sub1 = child.out.subscribe(() => {});
    const sub2 = child.out.subscribe(() => {});
    sub1.unsubscribe();
    sub1.unsubscribe();

    expect(child.observed()).toBe(true);
    sub2.unsubscribe();
    expect(child.observed()).toBe(false);
  });

  it('Sollte Subscriptions über outputToObservable zählen', () => {
    const fixture = TestBed.createComponent(UnboundHostComponent);
    fixture.detectChanges();
    const child = fixture.componentInstance.child();

    const sub = outputToObservable(child.out).subscribe();
    expect(child.observed()).toBe(true);

    sub.unsubscribe();
    expect(child.observed()).toBe(false);
  });
});

@Component({
  selector: 'lux-output-observed-child',
  template: `<span [class.observed]="observed()">child</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class ChildComponent {
  readonly out = output<string>();
  readonly observed = luxOutputObserved(this.out);
}

@Component({
  selector: 'lux-output-observed-unbound-host',
  template: `<lux-output-observed-child />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChildComponent]
})
class UnboundHostComponent {
  readonly child = viewChild.required(ChildComponent);
}

@Component({
  selector: 'lux-output-observed-bound-host',
  template: `
    @if (show()) {
      <lux-output-observed-child (out)="received.push($event)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChildComponent]
})
class BoundHostComponent {
  readonly show = signal(true);
  readonly child = viewChild(ChildComponent);
  received: string[] = [];
}
