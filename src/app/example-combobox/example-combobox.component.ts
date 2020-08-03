import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {CdkComboboxToggleTrigger} from "../combobox/combobox-toggle-trigger.directive";
import {CdkComboboxTextTrigger} from "../combobox/combobox-text-trigger";
import {Subject} from "rxjs";

@Component({
  selector: 'app-example-combobox',
  templateUrl: './example-combobox.component.html',
  styleUrls: ['./example-combobox.component.css']
})
export class ExampleComboboxComponent implements OnInit, AfterContentInit {
  @ViewChild('toggleCombobox', {static: true}) private readonly _toggleCombobox: CdkComboboxTextTrigger<string>;
  @ViewChild('textCombobox', {static: true}) private readonly _textCombobox: CdkComboboxTextTrigger<string>;
  @ViewChild('secondInput') input: ElementRef<HTMLInputElement>;

  name: string = 'No Value';
  readonly displayString = new Subject<string>();
  readonly inputValue = new Subject<string>();

  possibleWords = [
      'solar',
      'void',
      'arc',
      'stasis'
  ];

  ngOnInit() {
  }

  ngAfterContentInit() {
    this._textCombobox.panelValueChanged.subscribe(event => {
      console.log('about to change typed string');
      this.input.nativeElement.value = event.toString();
      this.inputValue.next(event.toString());
      console.log(this.displayString);
    });
  }

  getWords(value: string): string[] {
    console.log(value);
    let filtered: string[] = this.possibleWords;
    if (value !== null && value.length > 0) {
      filtered = this.possibleWords.filter(word => word.includes(value));
    }

    return filtered;
  }
}
