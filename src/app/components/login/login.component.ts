import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LoginService} from '../../providers/login.service';
import {FormBuilder} from '@angular/forms';
import {MessageService} from '../../services/message.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  flipped = false;
  loginForm = this.fb.group({
    email: [localStorage.getItem('email')],
    password: [''],
    remember: true
  });
  registerForm = this.fb.group({
    email: [''],
    password: [''],
    repeatPassword: [''],
  });

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
              private fb: FormBuilder,
              private user: LoginService,
              private message: MessageService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
  }

  login(value) {
    const {email, password} = value;
    this.user.login({email, password}).subscribe(res => {
      if (res) {
        this.message.openSnackBar('登陆成功');
        localStorage.setItem('email', email);
        this.dialogRef.close();
      } else {
        this.message.openSnackBar('登陆失败');
      }
    });
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
