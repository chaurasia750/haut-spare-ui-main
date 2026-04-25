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
  template: `
    <div class="select-wrapper">
      <label *ngIf="label" class="select-label">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      <div class="select-container">
        <input
          type="text"
          class="select-input"
          [placeholder]="placeholder"
          [value]="searchText"
          (input)="onSearch($event)"
          (focus)="openDropdown()"
          [class.open]="isOpen"
        />
        <div class="select-arrow">▼</div>

        <div *ngIf="isOpen" class="dropdown-menu">
          <div *ngFor="let opt of filteredOptions" class="dropdown-item" (click)="selectOption(opt)">
            {{ opt.label }}
          </div>
          <div *ngIf="filteredOptions.length === 0" class="dropdown-empty">
            No options found
          </div>
        </div>
      </div>
      <div *ngIf="selectedOption" class="selected-value">
        Selected: {{ selectedOption.label }}
      </div>
    </div>
  `,
  styles: [
    `
      .select-wrapper {
        position: relative;
      }

      .select-label {
        font-weight: 500;
        margin-bottom: 6px;
        font-size: 14px;
        color: #333;
        display: block;
      }

      .required {
        color: #e53e3e;
        margin-left: 4px;
      }

      .select-container {
        position: relative;
      }

      .select-input {
        width: 100%;
        padding: 10px 12px;
        padding-right: 30px;
        border: 1px solid #cbd5e0;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.2s;
        background-color: white;

        &:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        &.open {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      .select-arrow {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        font-size: 12px;
        color: #718096;
      }

      .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        border: 1px solid #cbd5e0;
        border-top: none;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 10;
      }

      .dropdown-item {
        padding: 10px 12px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;

        &:hover {
          background-color: #edf2f7;
        }

        &:active {
          background-color: #e2e8f0;
        }
      }

      .dropdown-empty {
        padding: 10px 12px;
        text-align: center;
        color: #a0aec0;
        font-size: 14px;
      }

      .selected-value {
        font-size: 12px;
        color: #718096;
        margin-top: 4px;
      }
    `,
  ],
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
