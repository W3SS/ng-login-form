import { Action } from '@ngrx/store';
import { LOGIN_START, LOGIN_SUCCESS, LOGIN_ERROR } from './authentication.actions';

export interface AuthenticationState {
  pending: boolean;
  isLogged: boolean;
  errors: Array<string>
};

const defaultState: AuthenticationState = {
  pending: false,
  isLogged: false,
  errors: [],
};

export function authenticationReducer(state = defaultState, { type, payload }: Action): AuthenticationState {
  switch (type) {
    case LOGIN_START:
      return {
        ...state,
        pending: true,
        isLogged: false,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        pending: false,
        isLogged: true,
        errors: [],
      };

    case LOGIN_ERROR:
      return {
        ...state,
        pending: false,
        isLogged: true,
        errors: payload,
      };

    default:
      return state;
  }
}
