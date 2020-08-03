import {
  AfterContentInit,
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

@Directive({
  selector: '[cdkToggleTrigger]',
  exportAs: 'cdkComboboxToggleTrigger',
  host: {
    '(click)': 'toggle()'
  },
})
export class CdkComboboxToggleTrigger<V= unknown>  implements AfterContentInit {

  @Input('triggerFor')
  get comboboxPanel(): CdkComboboxPanel<V> | undefined {
    return this._comboboxPanel;
  }
  set comboboxPanel(panel: CdkComboboxPanel<V>) {
    this._comboboxPanel = panel;
  }
  private _comboboxPanel: CdkComboboxPanel<V>;

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

  constructor(
      private readonly _elementRef: ElementRef<HTMLElement>,
      private readonly _overlay: Overlay,
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
