import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher} from '@angular/material';
import {LoginService} from '../../providers/login.service';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MessageService} from '../../services/message.service';
import {DatabaseService} from '../../services/database.service';

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  flipped = false;
  matcher = new MyErrorStateMatcher();
  loginForm = this.fb.group({
    email: [localStorage.getItem('email'), [
      Validators.required,
    ]],
    password: ['', [
      Validators.required,
    ]],
    remember: true
  });
  registerForm = this.fb.group({
    email: ['', [
      Validators.required,
    ]],
    password: ['', [
      Validators.required,
    ]],
    repeatPassword: [''],
  }, {
    validator: (group: FormGroup) => {
      return group.controls.password.value !== group.controls.repeatPassword.value ? {'repeat': true} : null;
    }
  });

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
              private fb: FormBuilder,
              private user: LoginService,
              private message: MessageService,
              private dbService: DatabaseService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
  }

  private setLogin(value, err: boolean, errMessage: string) {
    const {email} = value;
    if (!err) {
      this.message.setLoginState(email);
      localStorage.setItem('email', email);
      this.dbService.setSync();
      this.dialogRef.close();
    } else {
      this.message.openSnackBar(errMessage);
    }
  }

  login(value) {
    this.user.login(value).subscribe(err => {
      this.setLogin(value, err, '登陆失败');
    });
  }

  register(value) {
    this.user.register(value).subscribe(err => {
      this.setLogin(value, err, '注册失败');
    });
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
