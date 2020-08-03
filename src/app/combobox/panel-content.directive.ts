import {Directive, ElementRef, Input, OnInit, Optional} from '@angular/core';
import {ComboboxItem} from "./combobox-item";
import {Subject} from "rxjs";
import {CdkComboboxPanel} from "./combobox-panel";

let id = 0;

@Directive({
  selector: '[panelContent]',
  exportAs: 'panelContent',
  host: {
    'role': 'role',
    '[id]': 'dialogId'
  }
})
export class PanelContentDirective<V> implements OnInit {

  @Input()
  get value(): V {
    return this._value;
  }
  set value(val: V) {
    this._value = val;
  }

  dialogId = `dialog-${id++}`;
  role = 'dialog';
  _value: V;

  @Input('parentPanel') private readonly _explicitPanel: CdkComboboxPanel;

  constructor(
      private readonly _elementRef: ElementRef,
      @Optional() readonly _parentPanel?: CdkComboboxPanel<V>,
  ) { }

  ngOnInit() {
    this.registerWithPanel();
  }

  registerWithPanel(): void {
    if (this._parentPanel === null) {
      this._explicitPanel._registerContent(this.dialogId, this.role);
    } else {
      this._parentPanel._registerContent(this.dialogId, this.role);
    }
  }

  sendValue(): void {
    if (this._parentPanel === null) {
      this._explicitPanel.closePanel(this.value);
    } else {
      this._parentPanel.closePanel(this.value);
    }
  }
}
