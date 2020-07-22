import {Directive, EventEmitter, Input, Output, TemplateRef} from "@angular/core";

@Directive({
    selector: 'ng-template[cdkComboboxPanel]',
    exportAs: 'cdkComboboxPanel',
    host: {
    },
})
export class CdkComboboxPanel {

    constructor(readonly _templateRef: TemplateRef<unknown>) {
    }

    @Input()
    get value(): any {
        return this._value;
    }
    set value(val: any) {
        this._value = val;
        this.valueChanged.emit(this._value);
    }
    private _value: any;

    @Output('valueChanged') readonly valueChanged: EventEmitter<any> = new EventEmitter<any>();
}
