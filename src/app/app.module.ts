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
import { HomeScreenComponent } from './screens/home/home-screen.component';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './screens/home/home-routing.module';
import { DashboardScreenComponent } from './screens/dashboard/dashboard-screen.component';
import { DonationScreenComponent } from './screens/donation/donation-screen.component';
import { SettingsScreenComponent } from './screens/settings/settings-screen.component';
import { ChangePasswordSectionComponent } from './screens/settings/sections/change-password-section/change-password-section.component';
import { SignOutSectionComponent } from './screens/settings/sections/sign-out-section/sign-out-section.component';
import { ProfileDetailsSectionComponent } from './screens/settings/sections/profile-details-section/profile-details-section.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { DashboardOverviewSectionComponent } from './screens/dashboard/sections/overview-section/overview-section.component';
import { DashboardJoinedGroupsSectionComponent } from './screens/dashboard/sections/joined-groups-section/joined-groups-section.component';
import { DashboardMatchScheduleSectionComponent } from './screens/dashboard/sections/match-schedule-section/match-schedule-section.component';
import { NumberComponent } from './components/number/number.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInScreenComponent,
    ChangePasswordModalComponent,
    HomeScreenComponent,
    DonationScreenComponent,
    ProfileDetailsSectionComponent,
    ChangePasswordSectionComponent,
    SignOutSectionComponent,
    SettingsScreenComponent,
    DashboardOverviewSectionComponent,
    DashboardJoinedGroupsSectionComponent,
    DashboardMatchScheduleSectionComponent,
    DashboardScreenComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ profile: profileReducer }),
    AppRoutingModule,
    HomeRoutingModule,
    ModalComponent,
    FormFieldComponent,
    NumberComponent,
  ],
  providers: [provideAnimations(), provideToastr()],
  bootstrap: [AppComponent],
})
export class AppModule {}
