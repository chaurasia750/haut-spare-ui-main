import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { MemberProfile } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpService) {}

  /**
   * Get current member profile
   */
  getProfile(): Observable<MemberProfile> {
    return this.http.get<MemberProfile>('/profile');
  }

  /**
   * Update current member profile
   */
  updateProfile(profile: Partial<MemberProfile>): Observable<MemberProfile> {
    return this.http.put<MemberProfile>('/profile', profile);
  }

  /**
   * Upload profile avatar
   */
  uploadAvatar(file: File): Observable<MemberProfile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MemberProfile>('/profile/avatar', formData);
  }
}
