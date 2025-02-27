import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getLoggedInUser(): any {
    try {
      const userData = sessionStorage.getItem('loggedInUser');
      console.log('Raw session data:', userData); // Debug log
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Failed to parse session data:', e);
      return null;
    }
  }

  isLoggedIn(): boolean {
    const user = this.getLoggedInUser();
    return !!(user && user.USERNAME); // Adjusted to check for `USERNAME` field
  }
}
