import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativeDatePickerComponent } from './relative-date-picker.component';

describe('RelativeDatePickerComponent', () => {
  let component: RelativeDatePickerComponent;
  let fixture: ComponentFixture<RelativeDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelativeDatePickerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativeDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
