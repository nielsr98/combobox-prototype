import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExampleComboboxComponent } from './example-combobox/example-combobox.component';
import { CdkComboboxModule } from "./combobox/combobox-module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {OverlayModule} from "@angular/cdk/overlay";
import {FormsModule} from "@angular/forms";
import { PanelContentDirective } from './combobox/panel-content.directive';

@NgModule({
  declarations: [
    AppComponent,
    ExampleComboboxComponent,
    PanelContentDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkComboboxModule,
    FormsModule
  ],
  providers: [OverlayModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
