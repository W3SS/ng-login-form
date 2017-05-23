import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from "rxjs/Observable";
import { AppState } from '../app.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {login, loginError} from '../authentication.actions';
import {Subject} from "rxjs/Subject";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;

function convertErrors(controls) {
  return Object.keys(controls)
    .reduce((acc, curr) => ({ ...acc, [curr]: controls[curr].errors}), {})
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  public errors: string[] = [];
  public loginForm: FormGroup;
  public formSubmitted: boolean = false;
  public isLogged: boolean;
  public loggedEmail: string;
  public isPending: boolean;

  constructor(
    private store: Store<AppState>,
    fb: FormBuilder,
  ) {
    store.select('auth').subscribe(({ errors, isLogged, email, pending }) => {
      this.errors = errors;
      this.isLogged = isLogged;
      this.loggedEmail = email;
      this.isPending = pending;
    });

    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)] ],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)] ],
    });

  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.store.dispatch(login({ user: this.loginForm.value }));
    }
  }

  isError(label: string): boolean {
    return this.formSubmitted && !!this.loginForm.controls[label].errors;
  }

  getError(label: string, errorName: string): boolean {
    return this.isError(label) &&
      !!this.loginForm.controls[label].errors[errorName];
  }

}
