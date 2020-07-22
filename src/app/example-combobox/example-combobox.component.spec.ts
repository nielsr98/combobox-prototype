import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleComboboxComponent } from './example-combobox.component';

describe('ExampleComboboxComponent', () => {
  let component: ExampleComboboxComponent;
  let fixture: ComponentFixture<ExampleComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleComboboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
