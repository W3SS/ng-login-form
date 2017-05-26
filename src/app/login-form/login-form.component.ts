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
  public errors: Observable<string[]>;
  public loginForm: FormGroup;
  public isLogged: Observable<boolean>;
  public loggedEmail: Observable<string>;
  public isPending: Observable<boolean>;
  public isError: Observable<boolean>;
  public onSubmit$ = new Subject<any>();

  private formSubmitted: Observable<boolean>;

  constructor(
    store: Store<AppState>,
    fb: FormBuilder,
  ) {
    const authStore = store.select('auth');
    this.errors = authStore.pluck('errors');
    this.isLogged = authStore.pluck('isLogged');
    this.loggedEmail = authStore.pluck('email');
    this.isPending = authStore.pluck('pending');

    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)] ],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)] ],
    });

    this.formSubmitted = this.onSubmit$.mapTo(true);

    this.onSubmit$
      .filter(() => this.loginForm.valid)
      .withLatestFrom(this.loginForm.valueChanges, (_, formValue) => formValue)
      .map(formValue => login({ user: formValue }))
      .subscribe(store.dispatch.bind(store));

    this.isError = this.loginForm.valueChanges
      .startWith(null)
      .combineLatest(this.formSubmitted)
      .map(() => convertErrors(this.loginForm.controls));

  }

}
