import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { Profile } from '../../../../../shared/models/profile.model';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ProfileService } from '../../services/profile.service';
import { ToastServiceService } from '../../../../../shared/services/toast-service.service';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    TabsModule,
    TableModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    DividerModule,
    HttpClientModule,
    DropdownModule,CommonModule,CheckboxModule
  ],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss',
  providers: [ProfileService]
})
export class ProfilesComponent {
  profiles: Profile[] = [];
  IDProfiles: any[] = [];
  newProfile: string = '';
  selectedProfileId: number | null = null;
  editProfileType: string = ''; 
  deleteConfirmed: boolean = false;

  constructor(
    private profileService: ProfileService,
    private toastService: ToastServiceService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    this.getAllProfiles();
  }

  getAllProfiles() {
    this.profileService.getAllProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        this.updateDropdownOptions();
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load profiles');
      }
    });
  }

  updateDropdownOptions() {
    this.IDProfiles = this.profiles.map(profile => ({
      label: `${profile.profileId} - ${profile.profileType}`,
      value: profile.profileId
    }));
  }

  onProfileSelected(event: any) {
    if (event.value) {
      this.selectedProfileId = event.value;
      if (this.selectedProfileId) {
        this.loadProfileDetails(this.selectedProfileId);
      }
    }
  }

  loadProfileDetails(id: number) {
    this.editProfileType = '';
    this.profileService.getProfileById(id).subscribe({
      next: (profile) => {
        this.editProfileType = profile.profileType || '';
        console.log('Loaded profile type:', this.editProfileType);
      },
      error: (err) => {
        this.toastService.showError(err.error.message || 'Failed to load profile details');
      }
    });
  }

  saveProfile() {
    if (!this.newProfile.trim()) {
      this.toastService.showError('Profile type is required');
      return;
    }

    this.profileService.createProfile({ profileType: this.newProfile }).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Profile added successfully');
        this.newProfile = '';
        this.getAllProfiles();
      },
      error: (err) => {
        console.log(err);
        this.toastService.showError(err.error.details || 'Failed to add profile');
      }
    });
  }

  deleteProfile() {
    if (!this.selectedProfileId) {
      this.toastService.showError('Please select a profile to delete');
      return;
    }
    if (!this.deleteConfirmed) {
      this.toastService.showError('Please confirm deletion by checking the checkbox');
      return;
    }
      this.profileService.deleteProfile(this.selectedProfileId).subscribe({
        next: () => {
          this.toastService.showSuccess('Profile deleted successfully');
          this.selectedProfileId = null;
          this.getAllProfiles();
          this.resetDeleteForm()
        },
        error: (err) => {
          this.toastService.showError(err.error.message || 'Failed to delete profile');
        }
      });
    
  }

  closeDialog() {
    this.ref.close();
  }
  resetDeleteForm() {
    this.selectedProfileId = null;
    this.deleteConfirmed = false;
  }
}
