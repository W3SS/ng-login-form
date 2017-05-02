import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from "rxjs/Observable";
import { AppState } from '../app.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { login } from '../authentication.actions';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  public errors: Observable<string[]>;
  public loginForm: FormGroup;
  public formSubmitted = false;

  public formError = (label: string) =>
    (errorField: string): boolean =>
      this.formSubmitted &&
      this.loginForm.controls[label].errors &&
      !!this.loginForm.controls[label].errors[errorField];

  public emailError = this.formError('email');
  public passwordError = this.formError('password');

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) {
    this.errors = store.select('auth').pluck('errors');

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)] ],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)] ],
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.store.dispatch(login(this.loginForm.value));
    }
  }

}
