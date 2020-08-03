/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {CdkComboboxPanel} from "./combobox-panel";
import {CdkComboboxTextTrigger} from "./combobox-text-trigger";
import {CdkComboboxToggleTrigger} from "./combobox-toggle-trigger.directive";
import {OverlayModule} from "@angular/cdk/overlay";

const EXPORTED_DECLARATIONS = [
    CdkComboboxPanel,
    CdkComboboxTextTrigger,
    CdkComboboxToggleTrigger
];

@NgModule({
    imports: [OverlayModule],
    exports: EXPORTED_DECLARATIONS,
    declarations: EXPORTED_DECLARATIONS,
})
export class CdkComboboxModule {}
