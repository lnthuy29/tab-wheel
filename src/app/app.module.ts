import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { LogInScreenComponent } from './screens/log-in/log-in-screen.component';
import { AppRoutingModule } from './app-routing.module';
import { ProtectedComponent } from './screens/protected/protected.component';
import { RedirectComponent } from './components/redirect/redirect.component';
import { provideToastr } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LogInScreenComponent,
    ProtectedComponent,
    RedirectComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
],
  providers: [
    provideAnimations(),
    provideToastr()  
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
