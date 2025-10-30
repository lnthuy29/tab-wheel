import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from 'src/app/store/app.state';
import { clearUserProfile } from 'src/app/store/profile/profile.action';

@Component({
  selector: 'app-sign-out-section',
  templateUrl: './sign-out-section.component.html',
  styleUrl: './sign-out-section.component.scss',
})
export class SignOutSectionComponent {
  public constructor(
    private service: AuthService,
    private router: Router,
    private store: Store<AppState>,
  ) {}

  protected async handleButtonClicked(): Promise<void> {
    const { error } = await this.service.signOut();

    if (error) {
      console.error('Failed to sign out:', error);
      // Optionally, show a toast or alert here
      return;
    }

    this.store.dispatch(clearUserProfile());

    await this.router.navigate(['/log-in']);
  }
}
