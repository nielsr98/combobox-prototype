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
    selector: '[cdkComboboxTrigger]',
    exportAs: 'cdkComboboxTrigger',
    host: {
        '(click)': 'toggle()'
    },
})
export class CdkComboboxTrigger implements AfterContentInit {

  @Input('triggerFor')
  get comboboxPanel(): CdkComboboxPanel | undefined {
    return this._comboboxPanel;
  }
  set comboboxPanel(panel: CdkComboboxPanel) {
      this._comboboxPanel = panel;
  }
  private _comboboxPanel: CdkComboboxPanel;

  @Output('comboboxPanelOpened') readonly opened: EventEmitter<void> = new EventEmitter<void>();
  @Output('comboboxPanelClosed') readonly closed: EventEmitter<void> = new EventEmitter<void>();
  @Output('panelValueChanged') readonly panelValueChanged: EventEmitter<any> = new EventEmitter<any>();

  private _overlayRef: OverlayRef | null = null;
  private _panel: TemplatePortal;

  constructor(
      private readonly _elementRef: ElementRef<HTMLElement>,
      private readonly _overlay: Overlay,
      protected readonly _viewContainerRef: ViewContainerRef,
      @Optional() private readonly _directionality?: Directionality
  ) {}

  ngAfterContentInit() {
      this._comboboxPanel.valueChanged.subscribe(value => {
          this.panelValueChanged.emit(value);
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

    /** Get the configuration object used to create the overlay */
    private _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPositionStrategy(),
            scrollStrategy: this._overlay.scrollStrategies.block(),
            direction: this._directionality,
        });
    }

    /** Build the position strategy for the overlay which specifies where to place the menu */
    private _getOverlayPositionStrategy(): FlexibleConnectedPositionStrategy {
        return this._overlay
            .position()
            .flexibleConnectedTo(this._elementRef)
            .withPositions(this._getOverlayPositions());
    }

    /** Determine and return where to position the opened menu relative to the menu item */
    private _getOverlayPositions(): ConnectedPosition[] {
        return [
            {originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'},
            {originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom'},
            {originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top'},
            {originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom'},
        ];
    }

  private _getPortal() {
      const hasPanelChanged = this._comboboxPanel._templateRef !== this._panel?.templateRef;
      if (this._comboboxPanel && (!this._panel || hasPanelChanged)) {
          this._panel = new TemplatePortal(this._comboboxPanel._templateRef, this._viewContainerRef);
      }

      return this._panel;
  }

}
