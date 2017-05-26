import { Injectable } from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import { LOGIN_START, loginSuccess, loginError } from './authentication.actions';

@Injectable()
export class AuthenticationEffects {
  constructor(
    private actions$: Actions
  ) { }

  @Effect() login$ = this.actions$
    .ofType(LOGIN_START)
    .map(toPayload)
    .pluck('user')
    .debounceTime(1000)
    .map(({ email, password }) =>
      email === 'test@test.pl' && password === 'Password1' ?
      loginSuccess({ email }) :
      loginError({ errors: ['Invalid email or password'] })
    )
}
