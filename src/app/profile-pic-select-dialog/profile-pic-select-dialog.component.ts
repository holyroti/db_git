import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';  // Import CommonModule here

@Component({
  selector: 'app-profile-pic-select-dialog',
  templateUrl: './profile-pic-select-dialog.component.html',
  styleUrls: ['./profile-pic-select-dialog.component.css'],
  standalone: true,
  imports: [CommonModule]  // Include CommonModule in imports
})
export class ProfilePicSelectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProfilePicSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  selectPicture(pic: any): void {
    this.dialogRef.close(pic);
  }
}
