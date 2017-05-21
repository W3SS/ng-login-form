import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from "rxjs/Observable";
import { AppState } from '../app.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {login, loginError} from '../authentication.actions';
import {Subject} from "rxjs/Subject";

import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  public errors: Observable<string[]>;
  public loginForm: FormGroup;
  public formSubmitted: Observable<boolean>;
  public isLogged: Observable<boolean>;
  public loggedEmail: Observable<string>;
  public onSubmit$ = new Subject<any>();

  public isError: any;

  public formError: any;
  public emailError: any;
  passwordError: any;



  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private change: ChangeDetectorRef
  ) {
    const authStore = store.select('auth');
    this.errors = authStore.pluck('errors');
    this.isLogged = authStore.pluck('isLogged');
    this.loggedEmail = authStore.pluck('email');

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)] ],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)] ],
    });




  }

  ngOnInit() {
    this.formSubmitted = this.onSubmit$.mapTo(true);

    this.onSubmit$
      .map(() => login({ user: this.loginForm.value }))
      .filter(() => this.loginForm.valid)
      .subscribe(this.store.dispatch.bind(this.store));

    this.isError = (label: string) =>
      this.formSubmitted.map(() => !!this.loginForm.controls[label].errors)
        .do(() => this.change.markForCheck())
        .do(val => console.log(val, label, this.loginForm.controls[label].errors));

    this.formError = (label: string) =>
      (errorField: string): Observable<boolean> =>
        this.isError(label).map(() =>
          !!this.loginForm.controls[label].errors[errorField]);

  this.emailError = this.formError('email');
  this.passwordError = this.formError('password');
  }

}
