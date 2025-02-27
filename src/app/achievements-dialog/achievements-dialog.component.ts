import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-achievements-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements-dialog.component.html',
  styleUrl: './achievements-dialog.component.css'
})
export class AchievementsDialogComponent implements OnInit {
  badges = [
    { name: "Beginner", image: "path/to/beginner-badge.png" },
    { name: "Intermediate", image: "path/to/intermediate-badge.png" },
    { name: "Expert", image: "path/to/expert-badge.png" }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  close(): void {
    // Logic to close the modal
  }
}