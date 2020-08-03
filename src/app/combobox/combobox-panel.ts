import {Directive, TemplateRef} from "@angular/core";
import {Subject} from "rxjs";

@Directive({
    selector: 'ng-template[cdkComboboxPanel]',
    exportAs: 'cdkComboboxPanel',
    host: {
        'aria-controls': 'contentId',
        'aria-haspopup': 'contentType'
    },
})
export class CdkComboboxPanel<V = unknown> {

    valueUpdated: Subject<V> = new Subject<V>();
    contentId: string = '';
    contentType: string = '';

    constructor(
        readonly _templateRef: TemplateRef<unknown>,
    ) {
    }

    closePanel(data?: V) {
        this.valueUpdated.next(data);
    }

    _registerContent(contentId: string, contentType: string) {
        this.contentId = contentId;
        if (contentType !== 'listbox' && contentType !== 'dialog') {
            throw Error('CdkComboboxPanel content must be either a listbox or dialog');
        }
        this.contentType = contentType;
    }

}










