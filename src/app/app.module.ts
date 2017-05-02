import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from "@angular/common";
import { StoreModule } from '@ngrx/store';
import { authenticationReducer, AuthenticationState } from './authentication.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from './authentication.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';

export interface AppState {
  auth: AuthenticationState;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    StoreModule.provideStore({ auth: authenticationReducer }),
    EffectsModule.run(AuthenticationEffects),
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    }),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
