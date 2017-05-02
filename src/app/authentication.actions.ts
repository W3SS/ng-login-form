export const LOGIN_START = '[LOGIN] start';
export const LOGIN_SUCCESS = '[LOGIN] success';
export const LOGIN_ERROR = '[LOGIN] error';

interface UserCredentials {
  email: string;
  password: string;
}

type authActionType = { type: string, payload: UserCredentials };

function authAction(type: string) {
  return (payload?: any): authActionType => ({
    type,
    payload,
  });
}

export const login: (payload: { user: UserCredentials }) => authActionType = authAction(LOGIN_START);
export const loginSuccess: (payload: { email: string }) => authActionType = authAction(LOGIN_SUCCESS);
export const loginError: (payload: { errors: Array<string> }) => authActionType = authAction(LOGIN_ERROR);
