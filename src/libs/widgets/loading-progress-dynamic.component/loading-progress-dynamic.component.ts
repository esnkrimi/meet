import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
@Component({
  selector: 'app-loadingProgressDynamic',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    GoogleSigninButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './loading-progress-dynamic.component.html',
  styleUrl: './loading-progress-dynamic.component.css',
})
export class LoadingProgressDynamic implements OnInit {
  formComment = new FormGroup({
    comment: new FormControl(''),
  });

  constructor() {}
  ngOnInit(): void {}
}
