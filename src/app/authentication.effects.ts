import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { LOGIN_START, loginSuccess, loginError } from './authentication.actions';

@Injectable()
export class AuthenticationEffects {
  constructor(
    private actions$: Actions
  ) { }

  @Effect() login$ = this.actions$
    .ofType(LOGIN_START)
    .pluck('payload')
    .map(({ email, password }) => {
      if (email === 'test@test.pl' && password === 'Password1') {
        return loginSuccess();
      } else {
        return loginError(['Invalid credentails'])
      }
    })
}
