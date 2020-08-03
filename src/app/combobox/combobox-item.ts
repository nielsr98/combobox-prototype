import {CdkComboboxPanel} from "./combobox-panel";
import {Subject} from "rxjs";
import {ElementRef} from "@angular/core";

export interface ComboboxItem<V = unknown> {
    _parentPanel?: CdkComboboxPanel<V>;
    _value: V;
    _valueChanged: Subject<V>;

    registerWithPanel(): void;
    updateValue(data: V): void;
    getValue(): V;
    getPanel(): CdkComboboxPanel<V>;
    getElementRef(): ElementRef;
}
