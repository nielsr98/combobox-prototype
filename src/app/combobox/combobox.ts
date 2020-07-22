import {AfterContentInit, ContentChild, Directive, Input} from "@angular/core";
import {CdkComboboxTrigger} from "./combobox-trigger";

@Directive({
  selector: '[cdkCombobox]',
  exportAs: 'cdkCombobox',
  host: {
  },
})
export class CdkCombobox implements AfterContentInit {

  @ContentChild(CdkComboboxTrigger, {static: true}) private readonly _trigger: CdkComboboxTrigger;

  @Input()
  get value(): any {
    return this._value;
  }
  set value(val: any) {
    this._value = val;
  }
  private _value: any;

  ngAfterContentInit() {
    this._trigger.panelValueChanged.subscribe(value => {
      this.value = value;
      console.log(value);
    });
  }
}
