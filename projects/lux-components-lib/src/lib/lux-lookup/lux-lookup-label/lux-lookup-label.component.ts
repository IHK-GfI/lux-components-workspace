import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LuxFieldValues, LuxLookupParameters } from '../lux-lookup-model/lux-lookup-parameters';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';
import { LuxLookupHandlerService } from '../lux-lookup-service/lux-lookup-handler.service';
import { LuxLookupService } from '../lux-lookup-service/lux-lookup.service';

@Component({
  selector: 'lux-lookup-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lux-lookup-label.component.html'
})
export class LuxLookupLabelComponent implements OnInit {
  readonly luxLookupId = input('');
  readonly luxLookupUrl = input('/lookup/');
  readonly luxBezeichnung = input('kurz');
  readonly luxLookupKnr = input<number>();
  readonly luxTableNo = input<string>();
  readonly luxTableKey = input<string>();
  readonly luxFields = input<LuxFieldValues[]>();

  readonly entry = signal<LuxLookupTableEntry | undefined>(undefined);

  private readonly destroyRef = inject(DestroyRef);
  private readonly lookupService = inject(LuxLookupService);
  private readonly lookupHandler = inject(LuxLookupHandlerService);

  /**
   * Liefert die Bezeichnung (Kurz- oder Langbezeichnung) des Entries für den Key zur Tabelle.
   */
  readonly bezeichnung = computed(() => {
    const entry = this.entry();
    let bezeichnung;

    if (entry) {
      if ('kurz' === this.luxBezeichnung()) {
        bezeichnung = entry.kurzText;
      } else if ('lang' === this.luxBezeichnung()) {
        bezeichnung = entry.langText1;

        if (!bezeichnung) {
          bezeichnung = entry.kurzText;
        }
      }
    }

    return bezeichnung ?? '';
  });

  constructor() {
    let isFirstRun = true;

    effect(() => {
      this.luxLookupKnr();
      this.luxTableNo();
      this.luxTableKey();
      this.luxFields();

      untracked(() => {
        if (isFirstRun) {
          isFirstRun = false;
          return;
        }

        this.fetchLookupData();
      });
    });
  }

  ngOnInit() {
    if (!this.luxLookupKnr()) {
      console.warn(`The lookup label with the table number ${this.luxLookupKnr()} has no LookupKnr.`);
    }

    if (!this.luxLookupId()) {
      console.warn(`The lookup label with the table number ${this.luxTableNo()} has no LookupId.`);
    }

    if (!this.luxTableNo()) {
      console.warn(`The lookup label with the LookupId ${this.luxLookupId()} has no table number`);
    }

    if (!this.luxTableKey()) {
      console.warn(`The lookup label with the table number ${this.luxTableNo()} has no table key`);
    }

    this.fetchLookupData();

    this.lookupHandler.addLookupElement(this.luxLookupId());

    const lookupElementObs = this.lookupHandler.getLookupElementObsv(this.luxLookupId());
    if (!lookupElementObs) {
      throw Error(`Observable "${this.luxLookupId()}" not found."`);
    }

    lookupElementObs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.fetchLookupData();
    });
  }

  protected fetchLookupData() {
    if (this.isReadyToFetch()) {
      const keys: string[] = [this.luxTableKey()!];
      const lookupParameters = new LuxLookupParameters({ knr: this.luxLookupKnr()!, keys, fields: this.luxFields() });

      this.lookupService
        .getLookupTable(this.luxTableNo()!, lookupParameters, this.luxLookupUrl())
        .subscribe((entries: LuxLookupTableEntry[]) => {
          if (typeof entries !== 'undefined' && entries.length === 1) {
            this.entry.set(entries[0]);
          }
        });
    }
  }

  private isReadyToFetch(): boolean {
    return !!this.luxLookupKnr() && !!this.luxLookupId() && !!this.luxTableNo() && !!this.luxTableKey();
  }
}
