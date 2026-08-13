import { FormControl, FormGroup } from '@angular/forms';
import { luxAtLeastOneCheckboxChecked, luxAtLeastOneChecked } from './lux-validators';

describe('luxAtLeastOneCheckboxChecked', () => {
  function createGroup(values: Record<string, boolean>): FormGroup {
    const controls: Record<string, FormControl<boolean>> = {};
    for (const key of Object.keys(values)) {
      controls[key] = new FormControl<boolean>(values[key], { nonNullable: true });
    }
    return new FormGroup(controls);
  }

  it('sollte invalid sein, wenn keine Checkbox angehakt ist', () => {
    const group = createGroup({ cb1: false, cb2: false, cb3: false });
    const validator = luxAtLeastOneCheckboxChecked(['cb1', 'cb2', 'cb3']);
    const result = validator(group);
    expect(result).toEqual({ luxAtLeastOneCheckboxChecked: true });
  });

  it('sollte valid sein, wenn genau eine Checkbox angehakt ist', () => {
    const group = createGroup({ cb1: false, cb2: true, cb3: false });
    const validator = luxAtLeastOneCheckboxChecked(['cb1', 'cb2', 'cb3']);
    const result = validator(group);
    expect(result).toBeNull();
  });

  it('sollte valid sein, wenn alle Checkboxen angehakt sind', () => {
    const group = createGroup({ cb1: true, cb2: true, cb3: true });
    const validator = luxAtLeastOneCheckboxChecked(['cb1', 'cb2', 'cb3']);
    const result = validator(group);
    expect(result).toBeNull();
  });

  it('sollte null zurückgeben, wenn das Control kein FormGroup ist', () => {
    const control = new FormControl<boolean>(false, { nonNullable: true });
    const validator = luxAtLeastOneCheckboxChecked(['cb1']);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('sollte invalid sein, wenn controlNames leer ist', () => {
    const group = createGroup({ cb1: true, cb2: true });
    const validator = luxAtLeastOneCheckboxChecked([]);
    const result = validator(group);
    expect(result).toEqual({ luxAtLeastOneCheckboxChecked: true });
  });

  it('sollte invalid sein, wenn der angegebene Control-Name nicht in der FormGroup existiert', () => {
    const group = createGroup({ cb1: false });
    const validator = luxAtLeastOneCheckboxChecked(['nichtVorhanden']);
    const result = validator(group);
    expect(result).toEqual({ luxAtLeastOneCheckboxChecked: true });
  });

  it('sollte valid sein, wenn der angegebene Control-Name in der FormGroup existiert und angehakt ist', () => {
    const group = createGroup({ cb1: true, cb2: false });
    const validator = luxAtLeastOneCheckboxChecked(['cb1']);
    const result = validator(group);
    expect(result).toBeNull();
  });

  it('sollte als FormGroup-Validator korrekt konfiguriert werden können', () => {
    const group = new FormGroup(
      {
        opt1: new FormControl<boolean>(false, { nonNullable: true }),
        opt2: new FormControl<boolean>(false, { nonNullable: true })
      },
      { validators: luxAtLeastOneCheckboxChecked(['opt1', 'opt2']) }
    );

    expect(group.valid).toBeFalse();

    group.get('opt1')!.setValue(true);
    group.updateValueAndValidity();

    expect(group.valid).toBeTrue();
  });
});

describe('luxAtLeastOneChecked', () => {
  it('sollte false zurückgeben, wenn alle Werte false sind', () => {
    expect(luxAtLeastOneChecked([false, false, false])).toBeFalse();
  });

  it('sollte true zurückgeben, wenn genau ein Wert true ist', () => {
    expect(luxAtLeastOneChecked([false, true, false])).toBeTrue();
  });

  it('sollte true zurückgeben, wenn alle Werte true sind', () => {
    expect(luxAtLeastOneChecked([true, true, true])).toBeTrue();
  });

  it('sollte false zurückgeben, wenn das Array leer ist', () => {
    expect(luxAtLeastOneChecked([])).toBeFalse();
  });

  it('sollte false zurückgeben, wenn nur false-Werte übergeben werden', () => {
    expect(luxAtLeastOneChecked([false])).toBeFalse();
  });

  it('sollte true zurückgeben, wenn ein einzelner Wert true ist', () => {
    expect(luxAtLeastOneChecked([true])).toBeTrue();
  });
});
