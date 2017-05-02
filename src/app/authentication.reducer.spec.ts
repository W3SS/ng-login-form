import { authenticationReducer, defaultState } from "./authentication.reducer";
import { login, loginSuccess, loginError } from "./authentication.actions";

fdescribe('authenticationReducer reducer', () => {
  const user = {
    email: 'mateusz@tadeusz.com',
    password: '1234',
  };
  const errors = ['some', 'errors'];

  describe('when state was not passed as a authReducer argument and passed action does not exist', () => {
    const action = {
      type: 'ERROR',
      payload: {},
    };
    const newState = authenticationReducer(undefined, action);

    it('should return initialStateAuth', () => {
      expect(newState).toBe(defaultState);
    });
  });

  describe('when LOGIN_START is called', () => {
    const currentState = { ...defaultState };
    const newState = authenticationReducer(currentState, login({ user }));

    it('should set pending to true and clear other values', () => {
      expect(newState).toEqual({
        ...currentState,
        pending: true,
        isLogged: false,
        email: '',
      });
    });
  });

  describe('when LOGIN_SUCCESS is called', () => {
    const currentState = { ...defaultState };
    const newState = authenticationReducer(currentState, loginSuccess({ email: user.email }));

    it('should set pending to false, set email and clear other values', () => {
      expect(newState).toEqual({
        ...currentState,
        pending: false,
        isLogged: true,
        errors: [],
        email: user.email,
      });
    });
  });

  describe('when LOGIN_ERROR is called', () => {
    const currentState = { ...defaultState };
    const newState = authenticationReducer(currentState, loginError({ errors }));

    it('should set pending to false, set errors and clear other values', () => {
      expect(newState).toEqual({
        ...currentState,
        pending: false,
        isLogged: false,
        errors,
      });
    });
  });
});
