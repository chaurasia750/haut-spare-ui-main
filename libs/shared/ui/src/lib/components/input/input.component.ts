import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      <input
        [type]="type"
        [value]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [attr.aria-label]="label"
        (input)="onInput($event)"
        (change)="onChange($event)"
        (blur)="onBlur($event)"
        class="input-field"
        [class.error]="hasError"
      />
      <div *ngIf="hasError && errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [
    `
      .input-wrapper {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
      }

      .input-label {
        font-weight: 500;
        margin-bottom: 6px;
        font-size: 14px;
        color: #333;
      }

      .required {
        color: #e53e3e;
        margin-left: 4px;
      }

      .input-field {
        padding: 10px 12px;
        border: 1px solid #cbd5e0;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        &:disabled {
          background-color: #f7fafc;
          color: #a0aec0;
          cursor: not-allowed;
        }

        &.error {
          border-color: #e53e3e;

          &:focus {
            box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
          }
        }
      }

      .error-message {
        color: #e53e3e;
        font-size: 12px;
        margin-top: 4px;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() hasError: boolean = false;

  @Output() inputChange = new EventEmitter<string>();
  @Output() inputBlur = new EventEmitter<void>();

  value: string = '';

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.inputChange.emit(this.value);
    this.onChange(this.value);
  }

  onChange(value: any): void {}

  onTouched(): void {}

  onBlur(event: Event): void {
    this.onTouched();
    this.inputBlur.emit();
  }
}
