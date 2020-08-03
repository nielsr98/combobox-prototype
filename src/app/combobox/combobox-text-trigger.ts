import {
    AfterContentInit, ChangeDetectorRef,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    Optional,
    Output,
    ViewContainerRef
} from "@angular/core";
import {CdkComboboxPanel} from "./combobox-panel";
import {
    ConnectedPosition,
    FlexibleConnectedPositionStrategy,
    Overlay,
    OverlayConfig,
    OverlayRef
} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";
import {Directionality} from "@angular/cdk/bidi";
import {DELETE, DOWN_ARROW, END, ENTER, HOME} from "@angular/cdk/keycodes";
import {ChangeDetection} from "@angular/cli/lib/config/schema";

@Directive({
    selector: '[cdkCombobox]',
    exportAs: 'cdkComboboxTextTrigger',
    host: {
        '(click)': 'onClick()',
        '(focus)': 'onFocus()',
        '(keydown)': '_keydown($event)',
    },
})
export class CdkComboboxTextTrigger<V> implements AfterContentInit {

    @Input('triggerFor')
    get comboboxPanel(): CdkComboboxPanel<V> | undefined {
        return this._comboboxPanel;
    }
    set comboboxPanel(panel: CdkComboboxPanel<V>) {
        this._comboboxPanel = panel;
    }
    private _comboboxPanel: CdkComboboxPanel<V>;

    @Input('mode')
    get mode(): 'onFocus' | 'onClick' | 'onDownKey' | 'toggle' {
        return this._mode;
    }
    set mode(type: 'onFocus' | 'onClick' | 'onDownKey' | 'toggle') {
        this._mode = type;
    }
    private _mode: 'onFocus' | 'onClick' | 'onDownKey' | 'toggle' = 'onFocus';

    @Input('filter') filterWith: (word: string, list: V[]) => V[] = (word: string, list: V[]) => list;

    @Input('options')
    get autocompleteOptions(): V[] {
        return this._autocompleteOptions;
    }
    set autocompleteOptions(options: V[]) {
        this._autocompleteOptions = options;
    }
    private _autocompleteOptions: V[];

    @Input()
    get minCharacters(): number {
        return this._minCharacters;
    }
    set minCharacters(count: number) {
        this._minCharacters = count;
    }
    private _minCharacters = 0;

    @Input()
    get value(): V {
        return this._value;
    }
    set value(val: V) {
        this._value = val;
    }

    @Output('comboboxPanelOpened') readonly opened: EventEmitter<void> = new EventEmitter<void>();
    @Output('comboboxPanelClosed') readonly closed: EventEmitter<void> = new EventEmitter<void>();
    @Output('panelValueChanged') readonly panelValueChanged: EventEmitter<V> = new EventEmitter<V>();

    private _overlayRef: OverlayRef | null = null;
    private _panel: TemplatePortal;
    private _value: V;
    private typedString: string = '';

    constructor(
        private readonly _elementRef: ElementRef<HTMLElement>,
        private readonly _overlay: Overlay,
        private cd: ChangeDetectorRef,
        protected readonly _viewContainerRef: ViewContainerRef,
        @Optional() private readonly _directionality?: Directionality
    ) {}

    ngAfterContentInit() {
        this._comboboxPanel.valueUpdated.subscribe(data => {
            this._setComboboxValue(data);
            this.closePanel();
        });
    }

    toggle() {
        if (this.hasPanel()) {
            this.isPanelOpen() ? this.closePanel() : this.openPanel();
        }
    }

    onClick() {
        if (this.mode === 'toggle') {
            this.toggle();
        } else if (this.mode === 'onClick') {
            this.openPanel();
        }
    }

    onFocus() {
        if (this.mode !== 'onFocus') {
            return;
        }

        this.openPanel();
    }

    _keydown(event: KeyboardEvent) {
        const {keyCode} = event;
        console.log(keyCode);

        if (keyCode === DOWN_ARROW && this.mode === 'onDownKey') {
            this.toggle();
        }
    }

    _keypress(event: KeyboardEvent) {
        const {keyCode} = event;
        this.typedString += String.fromCharCode(keyCode);
        console.log('about to check filter');
        this.checkFilter();
    }

    private checkFilter() {
        if (this.typedString.length < this._minCharacters) {
            return;
        }

        const filtered = this.filterWith(this.typedString, this._autocompleteOptions);
        if (filtered.length > 0) {
            console.log('found match');
            this.autocompleteOptions = filtered;
            this.cd.markForCheck();
            if (!this.isPanelOpen()) {
                this.openPanel();
            }
        } else {
            if (this.isPanelOpen()) {
                this.closePanel();
            }
        }
    }

    openPanel() {
        if (!this.isPanelOpen()) {
            this.opened.next();
            this._overlayRef = this._overlayRef || this._overlay.create(this._getOverlayConfig());
            this._overlayRef.attach(this._getPortal());
        }
    }

    closePanel() {
        if (this.isPanelOpen()) {
            this.closed.next();
            this._overlayRef.detach();
        }
    }

    hasPanel(): boolean {
        return !!this.comboboxPanel;
    }

    isPanelOpen(): boolean {
        return this._overlayRef ? this._overlayRef.hasAttached() : false;
    }

    private _setComboboxValue(value: V) {
        console.log('changed value of combobox');
        const valueChanged = (this._value !== value);
        this._value = value;

        if (valueChanged) {
            this.panelValueChanged.emit(value);
            this._setTextContent(value);
        }
    }

    private _setTextContent(content: V) {
        this._elementRef.nativeElement.textContent = content.toString();
    }

    private _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPositionStrategy(),
            scrollStrategy: this._overlay.scrollStrategies.block(),
            direction: this._directionality,
        });
    }

    private _getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
        return this._overlay
            .position()
            .flexibleConnectedTo(this._elementRef)
            .withPositions(this._getOverlayPositions());
    }

    private _getOverlayPositions(): ConnectedPosition[] {
        return [
            {originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'},
            {originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom'},
            {originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top'},
            {originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom'},
        ];
    }

    private _getPortal() {
        const hasPanelChanged = this._comboboxPanel?._templateRef !== this._panel?.templateRef;
        if (this._comboboxPanel && (!this._panel || hasPanelChanged)) {
            this._panel = new TemplatePortal(this._comboboxPanel._templateRef, this._viewContainerRef);
        }

        return this._panel;
    }
}
