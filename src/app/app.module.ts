import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExampleComboboxComponent } from './example-combobox/example-combobox.component';
import { CdkComboboxModule } from "./combobox/combobox-module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {OverlayModule} from "@angular/cdk/overlay";

@NgModule({
  declarations: [
    AppComponent,
    ExampleComboboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkComboboxModule
  ],
  providers: [OverlayModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
