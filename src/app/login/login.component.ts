import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  showRegisterModal = false;

  // Registration fields
  regUsername: string = '';
  regDisplayName: string = '';
  regPassword: string = '';

  constructor(private router: Router, private authService: AuthenticationService) {}

  login(): void {
    this.authService.authenticate(this.username, this.password).subscribe({
      next: (result) => {
        if (result.success) {
          sessionStorage.setItem('loggedInUser', JSON.stringify(result.user));
          this.router.navigate(['/landing']);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
      error: (error) => {
        console.error('Authentication error:', error);
        this.errorMessage = 'Login failed due to system error';
      },
    });
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }

  register(): void {
    const user = {
      username: this.regUsername,
      displayName: this.regDisplayName,
      password: this.regPassword,
      icon: '/assets/avatars/avatar-placeholder.png', // Default icon
    };

    this.authService.register(user).subscribe({
      next: (result) => {
        alert('Registration successful! Please log in.');
        this.closeRegisterModal();
      },
      error: (error) => {
        console.error('Registration error:', error);
        alert('Registration failed.');
      },
    });
  }
}
