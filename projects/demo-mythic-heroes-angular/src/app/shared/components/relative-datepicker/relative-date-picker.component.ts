import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DateRange, MatDateRangeInput } from '@angular/material/datepicker';

@Component({
  selector: 'mrlonis-relative-date-picker',
  templateUrl: './relative-date-picker.component.html',
  styleUrls: ['./relative-date-picker.component.scss'],
})
export class RelativeDatePickerComponent implements OnInit, OnChanges {
  @ViewChild(MatDateRangeInput) private rangeInput!: MatDateRangeInput<Date>;
  @Input() defaultCreationDate = '';
  @Input() defaultDateRange: DateRange<Date> | null = null;
  @Output() datesSelected = new EventEmitter<
    | {
        option: string;
        range: DateRange<Date> | null;
      }
    | undefined
  >();
  maxDate = new Date();
  selectedCreationDate = '';
  defaultStartDate!: Date | null;
  defaultEndDate!: Date | null;

  ngOnInit(): void {
    this.selectedCreationDate = this.defaultCreationDate;
    this.defaultDateRange ? (this.defaultEndDate = this.defaultDateRange.end) : null;
    this.defaultDateRange ? (this.defaultStartDate = this.defaultDateRange.start) : null;

    if (
      this.selectedCreationDate === '1' ||
      this.selectedCreationDate === '2' ||
      this.selectedCreationDate === '7' ||
      this.selectedCreationDate === '30'
    ) {
      this.dateSelectionChanged(this.selectedCreationDate);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.defaultCreationDate && changes.defaultCreationDate.currentValue === '') {
      this.selectedCreationDate = '';
    }

    if (changes.defaultCreationDate && changes.defaultCreationDate.currentValue === 'custom') {
      this.defaultStartDate = null;
      this.defaultEndDate = null;
    }
  }

  clearCreationDateRange(): void {
    this.selectedCreationDate = '';
    this.datesSelected.emit();
  }

  dateSelectionChanged(selection: string): void {
    //Earliest Date
    let startDate = new Date();
    startDate = new Date(startDate.setHours(0, 0, 0, 0));
    startDate = new Date(startDate.setDate(startDate.getDate() - parseInt(selection)));
    //Today
    const endDate = new Date().setHours(0, 0, 0, 0);

    const dateRange = new DateRange(new Date(startDate), new Date(endDate));
    this.datesSelected.emit({ option: selection, range: dateRange });
  }

  dateRangeChange(): void {
    if (this.rangeInput.value?.start !== null && this.rangeInput.value?.end !== null) {
      this.datesSelected.emit({
        option: 'custom',
        range: this.rangeInput.value,
      });
    }
  }
}
