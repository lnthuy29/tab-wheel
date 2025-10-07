import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { LogInComponent } from './screens/log-in/log-in.component';
import { AppRoutingModule } from './app-routing.module';
import { ProtectedComponent } from './screens/protected/protected.component';
import { RedirectComponent } from './screens/redirect/redirect.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    ProtectedComponent,
    RedirectComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
