import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { UserService } from '../services/user.service';
import { VisualNovelComponent } from '../visual-novel/visual-novel.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, VisualNovelComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  showAchievements = false;
  showInfo = false;
  username: string = 'Guest';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const user = this.userService.getLoggedInUser();
    console.log('Retrieved user from session:', user); // Debug log

    if (!this.userService.isLoggedIn()) {
      console.log('User not logged in, redirecting to login.');
      this.router.navigate(['/']);
    } else {
      this.username = user.DISPLAYNAME || 'Guest';
      console.log('Welcome,', this.username); // Debug log
    }
  }
  
  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/']); // Redirect to login
  }

  startGame(): void {
    console.log('Navigating to Parsons Problem page');
    this.router.navigate(['/parsons']); // Navigate to the /parsons route
  }

  openAchievements(): void {
    this.showAchievements = true;
  }

  closeAchievements(): void {
    this.showAchievements = false;
  }

  openInfo(): void {
    this.showInfo = true;
  }

  closeInfo(): void {
    this.showInfo = false;
  }
}
