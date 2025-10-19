import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { LogInScreenComponent } from './screens/log-in/log-in-screen.component';
import { AppRoutingModule } from './app-routing.module';
import { provideToastr } from 'ngx-toastr';
import { ModalComponent } from './components/modal/modal.component';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { StoreModule } from '@ngrx/store';
import { profileReducer } from './store/profile/profile.reducer';
import { HomeComponent } from './screens/home/home.component';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './screens/home/home-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LogInScreenComponent,
    ChangePasswordModalComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HomeRoutingModule,
    StoreModule.forRoot({ profile: profileReducer }),
    ModalComponent,
  ],
  providers: [provideAnimations(), provideToastr()],
  bootstrap: [AppComponent],
})
export class AppModule {}
