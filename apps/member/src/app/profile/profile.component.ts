import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '@haut-spare/data-access-api';
import { MemberProfile } from '@haut-spare/util-constants';
import { CardComponent, ButtonComponent, InputComponent, LoadingSpinnerComponent } from '@haut-spare/shared-ui';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, InputComponent, LoadingSpinnerComponent],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Member Profile</h1>
        <p class="subtitle">Manage your personal information</p>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <app-loading-spinner message="Loading profile..."></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading && profile" class="profile-content">
        <app-card title="Personal Information">
          <div class="form-group">
            <app-input
              label="First Name"
              [(ngModel)]="profile.firstName"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-group">
            <app-input
              label="Last Name"
              [(ngModel)]="profile.lastName"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-group">
            <app-input
              label="Email"
              type="email"
              [(ngModel)]="profile.email"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-group">
            <app-input
              label="Phone"
              type="tel"
              [(ngModel)]="profile.phone"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-group">
            <app-input
              label="Address"
              [(ngModel)]="profile.address"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-group">
            <app-input
              label="City"
              [(ngModel)]="profile.city"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-group">
            <app-input
              label="State"
              [(ngModel)]="profile.state"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-group">
            <app-input
              label="Zip Code"
              [(ngModel)]="profile.zipCode"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-group">
            <app-input
              label="Country"
              [(ngModel)]="profile.country"
              (inputChange)="onFormChange()"
            ></app-input>
          </div>

          <div class="form-actions">
            <app-button variant="secondary" (click)="onCancel()">Cancel</app-button>
            <app-button variant="primary" (click)="onSave()" [disabled]="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </app-button>
          </div>
        </app-card>
      </div>

      <div *ngIf="!isLoading && error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        padding: 24px;
        max-width: 600px;
        margin: 0 auto;
      }

      .profile-header {
        margin-bottom: 32px;
      }

      .profile-header h1 {
        font-size: 28px;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
      }

      .subtitle {
        color: #718096;
        margin: 8px 0 0 0;
        font-size: 14px;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .profile-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e2e8f0;
      }

      .error-message {
        background-color: #fed7d7;
        color: #742a2a;
        padding: 16px;
        border-radius: 8px;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  profile: MemberProfile | null = null;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  hasChanges = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = null;
    this.profileService.getProfile().subscribe(
      (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      (error) => {
        this.error = error?.message || 'Failed to load profile';
        this.isLoading = false;
      }
    );
  }

  onFormChange(): void {
    this.hasChanges = true;
  }

  onSave(): void {
    if (!this.profile || !this.hasChanges) {
      return;
    }

    this.isSaving = true;
    this.profileService.updateProfile(this.profile).subscribe(
      (updated) => {
        this.profile = updated;
        this.hasChanges = false;
        this.isSaving = false;
      },
      (error) => {
        this.error = error?.message || 'Failed to save profile';
        this.isSaving = false;
      }
    );
  }

  onCancel(): void {
    this.loadProfile();
    this.hasChanges = false;
  }
}
      }

      .info-value {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    `,
  ],
})
export class ProfileComponent {}
