import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { By } from "@angular/platform-browser";
import {login} from "../authentication.actions";

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  const authStore = {
    errors: ['some', 'errors'],
    isLogged: false,
    email: 'some@email.com'
  };
  const authStoreSubject = new BehaviorSubject(authStore);
  const mockedStore = {
    select: jasmine.createSpy('select').and.returnValue(authStoreSubject),
    dispatch: jasmine.createSpy('dispatch'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      declarations: [ LoginFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ FormBuilder,
        { provide: Store, useValue: mockedStore },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get errors from store', () => {
    const errors = fixture
      .debugElement
      .queryAll(By.css('.height-auto .error'))
      .map(item => item.nativeElement.textContent);

    authStore.errors.forEach(errorText => expect(errors.includes(errorText)).toBeTruthy());
  });

  describe('when submit button is clicked', () => {
    beforeEach(() => {
      fixture.debugElement.queryAll(By.css('form'))[0].triggerEventHandler('submit', new Event('submit'));
      fixture.detectChanges();
    });

    it('should show error "E-mail is required" under email input', () => {
      const error = fixture
        .debugElement
        .query(By.css(`input[name="email"] + .error`))
        .nativeElement.textContent;

      expect(error).toBe('E-mail is required');
    });

    it('should add invalid class to email input', () => {
      const input = fixture
        .debugElement
        .query(By.css(`input[name="email"]`))
        .nativeElement;

      expect(input.classList.contains('invalid')).toBeTruthy();
    });

    it('should show error "Password is required" under password input', () => {
      const error = fixture
        .debugElement
        .query(By.css(`input[name="password"] + .error`))
        .nativeElement.textContent;

      expect(error).toBe('Password is required');
    });

    it('should add invalid class to password input', () => {
      const input = fixture
        .debugElement
        .query(By.css(`input[name="password"]`))
        .nativeElement;

      expect(input.classList.contains('invalid')).toBeTruthy();
    });
  });

  describe('when wrong email is typed and submit button is clicked', () => {
    ['asd', 'asd@', 'asd@asd'].forEach(value => {
      beforeEach(() => {
        const input = fixture
          .debugElement
          .query(By.css(`input[name="email"]`));
        input.nativeElement.value = value;
        input.triggerEventHandler('input', { target: { value } });
        fixture.debugElement.queryAll(By.css('form'))[0].triggerEventHandler('submit', new Event('submit'));
        fixture.detectChanges();
      });

      it('should show error "E-mail is invalid" under email input', () => {
        const error = fixture
          .debugElement
          .query(By.css(`input[name="email"] + .error`))
          .nativeElement.textContent;

        expect(error).toBe('E-mail is invalid');
      });

      it('should add invalid class to email input', () => {
        const input = fixture
          .debugElement
          .query(By.css(`input[name="email"]`))
          .nativeElement;

        expect(input.classList.contains('invalid')).toBeTruthy();
      });
    });
  });

  describe('when wrong password is typed and submit button is clicked', () => {
    ['asd', 'asdzxc123', 'Aasdzxc', 'a1A'].forEach(value => {
      beforeEach(() => {
        const input = fixture
          .debugElement
          .query(By.css(`input[name="password"]`));
        input.nativeElement.value = value;
        input.triggerEventHandler('input', { target: { value } });
        fixture.debugElement.queryAll(By.css('form'))[0].triggerEventHandler('submit', new Event('submit'));
        fixture.detectChanges();
      });

      it('should show error "Password must be..." under password input', () => {
        const error = fixture
          .debugElement
          .query(By.css(`input[name="password"] + .error`))
          .nativeElement.textContent;

        expect(error).toContain('Password must be at least 6');
      });

      it('should add invalid class to password input', () => {
        const input = fixture
          .debugElement
          .query(By.css(`input[name="password"]`))
          .nativeElement;

        expect(input.classList.contains('invalid')).toBeTruthy();
      });
    });
  });

  describe('when correct email and password are typed and submit button is clicked', () => {
    const email = 'asd@asd.pl';
    const password = 'Password123';

    beforeEach(() => {
      const emailInput = fixture
        .debugElement
        .query(By.css(`input[name="email"]`));
      emailInput.nativeElement.value = email;
      emailInput.triggerEventHandler('input', { target: { value: email } });
      const passwordInput = fixture
        .debugElement
        .query(By.css(`input[name="password"]`));
      passwordInput.nativeElement.value = password;
      passwordInput.triggerEventHandler('input', { target: { value: password } });
      fixture.debugElement.queryAll(By.css('form'))[0].triggerEventHandler('submit', new Event('submit'));
      fixture.detectChanges();
    });

    it('should not show error under email input', () => {
      const error = fixture
        .debugElement
        .query(By.css(`input[name="email"] + .error`));

      expect(error).toBeFalsy();
    });

    it('should not add invalid class to email input', () => {
      const input = fixture
        .debugElement
        .query(By.css(`input[name="email"]`))
        .nativeElement;

      expect(input.classList.contains('invalid')).toBeFalsy();
    });

    it('should not show error under password input', () => {
      const error = fixture
        .debugElement
        .query(By.css(`input[name="password"] + .error`));

      expect(error).toBeFalsy();
    });

    it('should not add invalid class to password input', () => {
      const input = fixture
        .debugElement
        .query(By.css(`input[name="password"]`))
        .nativeElement;

      expect(input.classList.contains('invalid')).toBeFalsy();
    });

    it('should call dispatcher with proper credentails', () => {
      expect(mockedStore.dispatch).toHaveBeenCalledWith(login({ user: { email, password }}));
    });
  });
});
