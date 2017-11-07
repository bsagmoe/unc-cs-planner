import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-confirm-delete',
  template: `
            <h2 mat-dialog-title>Delete Comment</h2>
            <mat-dialog-content>Are you sure?</mat-dialog-content>
            <mat-dialog-actions>
              <button class="btn btn-default" mat-button [mat-dialog-close]="false" style="margin-right: .5em;">No</button>
              <!-- Can optionally provide a result for the closing dialog. -->
              <button class="btn btn-default" mat-button [mat-dialog-close]="true">Yes</button>
            </mat-dialog-actions>
            `
})

export class ConfirmDeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) { }
}
