import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { AuthenticationEffects } from './authentication.effects';
import { inject, TestBed } from "@angular/core/testing";
import { login, loginError, loginSuccess } from "./authentication.actions";

let runner: EffectsRunner;
let authenticationEffects: AuthenticationEffects;

describe('AuthenticationEffects', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      AuthenticationEffects
    ]
  }));

  beforeEach(inject([
      EffectsRunner, AuthenticationEffects
    ],
    (_runner, _authenticationEffects) => {
      runner = _runner;
      authenticationEffects = _authenticationEffects;
    }
  ));

  it('should return a LOGIN_ERROR action after logging in with wrong credentials', () => {
    runner.queue(login({ user: { email: 'wrong@email.pl', password: 'wrongpassword' } }));

    authenticationEffects.login$.subscribe(result => {
      expect(result).toEqual(loginError({ errors: ['Invalid credentials'] }));
    });
  });

  it('should return a LOGIN_SUCCESS action after logging in with proper credentials', () => {
    runner.queue(login({ user: { email: 'test@test.pl', password: 'Password1' } }));

    authenticationEffects.login$.subscribe(result => {
      expect(result).toEqual(loginSuccess({ email: 'test@test.pl' }));
    });
  });
});


