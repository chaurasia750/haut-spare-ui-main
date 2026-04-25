import { Component, OnInit, Input, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MemberProfile } from '@haut-spare/util/constants';
import { InputComponent, ButtonComponent, CardComponent, LoadingSpinnerComponent } from '@haut-spare/shared-ui';
import { ProfileService } from './profile.service';

/**
 * Reusable profile form component
 * Used by Member remote for profile editing
 * Expects a ProfileService provider in the component hierarchy
 */
@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    CardComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1 class="profile-title">{{ title }}</h1>
        <p class="profile-subtitle">{{ subtitle }}</p>
      </div>

      <app-loading-spinner
        *ngIf="loading$ | async"
        message="Loading profile..."
      ></app-loading-spinner>

      <div *ngIf="!(loading$ | async)" class="profile-content">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <app-card>
            <div class="form-group">
              <app-input
                label="First Name"
                placeholder="Enter your first name"
                formControlName="firstName"
                [hasError]="isFieldInvalid('firstName')"
                errorMessage="First name is required"
              ></app-input>
            </div>

            <div class="form-group">
              <app-input
                label="Last Name"
                placeholder="Enter your last name"
                formControlName="lastName"
                [hasError]="isFieldInvalid('lastName')"
                errorMessage="Last name is required"
              ></app-input>
            </div>

            <div class="form-group">
              <app-input
                label="Email"
                type="email"
                placeholder="Enter your email"
                formControlName="email"
                [hasError]="isFieldInvalid('email')"
                errorMessage="Valid email is required"
              ></app-input>
            </div>

            <div class="form-group">
              <app-input
                label="Phone"
                type="tel"
                placeholder="Enter your phone number"
                formControlName="phone"
              ></app-input>
            </div>

            <div class="form-group">
              <app-input
                label="Address"
                placeholder="Enter your address"
                formControlName="address"
              ></app-input>
            </div>

            <div class="form-group">
              <app-input
                label="City"
                placeholder="Enter your city"
                formControlName="city"
              ></app-input>
            </div>

            <div class="form-row">
              <div class="form-group">
                <app-input
                  label="State"
                  placeholder="Enter your state"
                  formControlName="state"
                ></app-input>
              </div>

              <div class="form-group">
                <app-input
                  label="Postal Code"
                  placeholder="Enter your postal code"
                  formControlName="postalCode"
                ></app-input>
              </div>
            </div>

            <div class="form-actions">
              <app-button
                variant="secondary"
                (click)="onCancel()"
                type="button"
              >
                Cancel
              </app-button>
              <app-button
                variant="primary"
                [disabled]="!profileForm.valid || (loading$ | async)"
              >
                Save Profile
              </app-button>
            </div>
          </app-card>
        </form>

        <div
          *ngIf="(error$ | async) as error"
          class="error-section"
        >
          <app-card variant="error">
            <p class="error-message">{{ error }}</p>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
      }

      .profile-header {
        margin-bottom: 32px;
      }

      .profile-title {
        font-size: 28px;
        font-weight: 700;
        color: #1a202c;
        margin: 0 0 8px 0;
      }

      .profile-subtitle {
        font-size: 16px;
        color: #718096;
        margin: 0;
      }

      .profile-content {
        width: 100%;
      }

      form {
        width: 100%;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;

        .form-group {
          margin-bottom: 0;
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e2e8f0;
      }

      .error-section {
        margin-top: 20px;
      }

      .error-message {
        color: #742a2a;
        margin: 0;
      }

      @media (max-width: 768px) {
        .profile-container {
          padding: 16px;
        }

        .profile-title {
          font-size: 24px;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column;
        }

        .form-actions app-button {
          width: 100%;
        }
      }
    `,
  ],
})
export class ProfileFormComponent implements OnInit {
  @Input() title: string = 'Edit Profile';
  @Input() subtitle: string = 'Update your personal information';

  profileForm!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private profileService: ProfileService;

  constructor(
    private fb: FormBuilder,
    private injector: Injector
  ) {
    this.profileService = this.injector.get(ProfileService);
    this.loading$ = this.profileService.isLoading();
    this.error$ = this.profileService.getError();

    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
    });
  }

  ngOnInit(): void {
    this.profileService.loadProfile();
    this.profileService.getProfile().subscribe((profile) => {
      if (profile) {
        this.profileForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          postalCode: profile.postalCode,
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.value);
    }
  }

  onCancel(): void {
    window.history.back();
  }
}
