/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CdkCombobox} from "./combobox";
import {CdkComboboxPanel} from "./combobox-panel";
import {CdkComboboxTrigger} from "./combobox-trigger";
import {OverlayModule} from "@angular/cdk/overlay";

const EXPORTED_DECLARATIONS = [CdkCombobox, CdkComboboxPanel, CdkComboboxTrigger];
@NgModule({
    imports: [OverlayModule],
    exports: EXPORTED_DECLARATIONS,
    declarations: EXPORTED_DECLARATIONS,
})
export class CdkComboboxModule {}
