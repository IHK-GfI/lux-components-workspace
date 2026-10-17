export class AutocompleteAcExampleOption {
  label: string;
  short: string;
  value: string;
  gueltigAb: Date;

  constructor(label: string, short: string, value: string, gueltigAb: Date) {
    this.label = label;
    this.short = short;
    this.value = value;
    this.gueltigAb = gueltigAb;
  }
}
