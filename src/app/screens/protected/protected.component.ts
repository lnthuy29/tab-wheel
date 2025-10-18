import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { selectProfile } from 'src/app/store/profile/profile.selector';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrl: './protected.component.scss',
})
export class ProtectedComponent implements OnInit {
  public constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.store
      .select(selectProfile)
      .subscribe((profile) => {
        console.log('Logged in profile:', profile);
      });
  }
}
