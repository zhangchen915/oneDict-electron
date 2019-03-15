import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LoginService} from '../../providers/login.service';
import {FormBuilder} from '@angular/forms';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  flipped = false;
  loginForm = this.fb.group({
    email: [''],
    password: ['']
  });
  registerForm = this.fb.group({
    email: [''],
    password: [''],
    repeatPassword: [''],
  });

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
              private fb: FormBuilder,
              private user: LoginService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
  }

  login(value) {
    this.user.login(value);
  }

  register(value) {
    // this.user.register(value);
  }

  flip() {
    this.flipped = !this.flipped;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
  }
}
