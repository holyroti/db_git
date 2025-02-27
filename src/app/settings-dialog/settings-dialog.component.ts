import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css'],
  standalone: true
})
export class SettingsDialogComponent {
  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
