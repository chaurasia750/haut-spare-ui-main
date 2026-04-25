import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() required: boolean = false;

  @Output() selectionChange = new EventEmitter<SelectOption>();

  isOpen: boolean = false;
  searchText: string = '';
  selectedOption: SelectOption | null = null;
  filteredOptions: SelectOption[] = [];

  ngOnInit(): void {
    this.filteredOptions = this.options;
  }

  ngOnChanges(): void {
    this.filteredOptions = this.options;
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value.toLowerCase();
    this.filteredOptions = this.options.filter((opt) =>
      opt.label.toLowerCase().includes(this.searchText)
    );
  }

  selectOption(option: SelectOption): void {
    if (!option.disabled) {
      this.selectedOption = option;
      this.searchText = option.label;
      this.isOpen = false;
      this.selectionChange.emit(option);
      this.onChange(option.value);
    }
  }

  openDropdown(): void {
    this.isOpen = true;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      const option = this.options.find((opt) => opt.value === value);
      if (option) {
        this.selectedOption = option;
        this.searchText = option.label;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value: any): void {}

  onTouched(): void {}
}
