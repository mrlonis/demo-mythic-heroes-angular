import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormField, MatFormFieldAppearance, MatFormFieldControl, MAT_FORM_FIELD } from '@angular/material/form-field';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResource } from '../../../services/api/interfaces';

export abstract class MrlonisAutocompleteInputDataSource<ObjectType extends BaseResource> {
  loading = true;
  data: ObjectType[] | undefined = undefined;

  /**
   * This function is used to convert the list of Practitioners into
   * a displayable list of string names as opposed to a list of [object Object]
   *
   * @param option The option to convert to a Displayable string in the MatAutoComplete List
   * @returns The stringified form of the MatAutocomplete Option
   */
  abstract getOptionText(option: ObjectType | string | null): string;

  /**
   *
   * @param value The value in question to filter. This is either a string or a Practitioner.
   * The reason for the split possibilities is due to the mat auto complete returning a full
   * bodied Practitioner when selected, whereas when you type into the input box, it is feeding in a string.
   * @returns The newly filtered list of Practitioners using the original list as reference.
   */
  abstract filter(value: string | ObjectType | null): ObjectType[];
}

@Component({
  selector: 'mrlonis-autocomplete-input',
  templateUrl: './mrlonis-autocomplete-input.component.html',
  styleUrls: ['./mrlonis-autocomplete-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: MrlonisAutocompleteInputComponent }],
})
export class MrlonisAutocompleteInputComponent<ObjectType extends BaseResource>
  implements MatFormFieldControl<ObjectType>, ControlValueAccessor, OnInit, OnDestroy, OnChanges
{
  static nextId = 0;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;

  @Input() data!: MrlonisAutocompleteInputDataSource<ObjectType>;
  @Input() startWith = '';
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() matAutocomplete?: MatAutocomplete;
  @Input('aria-describedby') userAriaDescribedBy = '';

  @ViewChild('search') searchInput!: HTMLInputElement;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) inputAutoComplete!: MatAutocompleteTrigger;

  private _placeholder = '';
  private _required = false;
  private _disabled = false;

  filteredData: Observable<ObjectType[]> = of([]);
  formControl = new FormControl('');
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'practitioner-autocomplete';
  arrowType = 'expand_more';
  id = `practitioner-autocomplete-${MrlonisAutocompleteInputComponent.nextId++}`;
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any */
  onChange = (_: any) => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  onTouched = () => {};

  get empty() {
    return !this.formControl.value;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.formControl.disable() : this.formControl.enable();
    this.stateChanges.next();
  }

  @Input()
  get value(): ObjectType | null {
    if (this.formControl.valid) {
      return <ObjectType | null>this.formControl.value;
    }
    return null;
  }
  set value(practitioner: ObjectType | null) {
    this.formControl.setValue(practitioner);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.formControl.invalid && this.touched;
  }

  constructor(
    public _focusMonitor: FocusMonitor,
    public _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector('.mrlonis-practitioner-autocomplete-container');
    if (controlElement !== null) {
      controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  onContainerClick() {
    if (this.formControl.valid) {
      this._focusMonitor.focusVia(this.searchInput, 'program');
    } else {
      this._focusMonitor.focusVia(this.searchInput, 'program');
    }
  }

  writeValue(practitioner: ObjectType | null): void {
    this.value = practitioner;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  registerOnChange(fn: any): void {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    this.onChange = fn;
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  registerOnTouched(fn: any): void {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  ngOnInit(): void {
    console.log('ngOnInit()');
    console.log(this.startWith);
    this.filteredData = this.formControl.valueChanges.pipe(map((value) => this.data.filter(<string>value)));
    this.processStartWith();
  }

  /**
   * Unsure if I will be using this function.
   * Leaving it around for now to log the events
   * and see if there is anything of value to use
   *
   * @param event The MatAutoCompleteSelectedEvent
   */
  onFilterOptionSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('onFilterOptionSelected(): Starting...');
    console.log(event);
  }

  /**
   * This function was needed so that the mat auto complete loads on first click.
   * Before implementing this, the mat auto complete would never load until the
   * user types into the input, DESPITE the input being loaded with a startWith string.
   *
   * @param changes The Changes returned by the lifecycle manager
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.startWith) {
      this.startWith = <string>changes.startWith.currentValue;

      this.processStartWith();
    }
    if (changes.data) {
      this.data = <MrlonisAutocompleteInputDataSource<ObjectType>>changes.data.currentValue;
      this.filteredData = this.formControl.valueChanges.pipe(map((value) => this.data.filter(<string>value)));
      this.processStartWith();
    }
  }

  /**
   * Applies a pre-filled selection to the form control
   * if it finds an appropriate single match in data list
   */
  processStartWith(): void {
    const initialSelection: ObjectType[] = this.data.filter(this.startWith);

    if (initialSelection.length == 1) {
      this.formControl.setValue(initialSelection[0]);

      this.placeholder = this.data.getOptionText(initialSelection[0]);
    }
  }

  openPanel(event: Event): void {
    event.stopPropagation();
    this.inputAutoComplete.openPanel();
  }

  closePanel(event: Event): void {
    event.stopPropagation();
    this.inputAutoComplete.closePanel();
    this.writeValue(null);
  }

  panelOpened(): void {
    this.arrowType = 'expand_less';
  }

  panelClosed(): void {
    this.arrowType = 'expand_more';
  }

  isNotEmpty(): boolean {
    const currentValue = this.value;
    if (currentValue == null) {
      return false;
    } else if (this.data.getOptionText(currentValue) == '') {
      return false;
    }
    return true;
  }
}
