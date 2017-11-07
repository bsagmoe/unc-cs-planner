import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
    selector: 'app-verify-email',
    template: `<h2 mat-dialog-title>Verify Email</h2>
            <mat-dialog-content>
                In order to make a post or reply with a comment, you must first verify your e-mail account<br>
                After verifying your email, reload this page.
            </mat-dialog-content>
            <mat-dialog-actions>
                <button class="btn btn-default" mat-button [mat-dialog-close]="true">Resend</button>
                <button class="btn btn-default" mat-button [mat-dialog-close]>Close</button>
            </mat-dialog-actions>`
})

export class VerifyEmailDialogComponent {
    constructor(public dialogRef: MatDialogRef<VerifyEmailDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) {}
}
