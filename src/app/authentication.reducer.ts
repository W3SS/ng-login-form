import { Action } from '@ngrx/store';
import { LOGIN_START, LOGIN_SUCCESS, LOGIN_ERROR } from './authentication.actions';

export interface AuthenticationState {
  pending: boolean;
  isLogged: boolean;
  errors: Array<string>,
  email: string,
};

export const defaultState: AuthenticationState = {
  pending: false,
  isLogged: false,
  errors: [],
  email: '',
};

export function authenticationReducer(state = defaultState, { type, payload }: Action): AuthenticationState {
  switch (type) {
    case LOGIN_START:
      return {
        ...state,
        pending: true,
        isLogged: false,
        email: '',
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        pending: false,
        isLogged: true,
        errors: [],
        email: payload.email
      };

    case LOGIN_ERROR:
      return {
        ...state,
        pending: false,
        isLogged: false,
        errors: payload.errors,
      };

    default:
      return state;
  }
}
