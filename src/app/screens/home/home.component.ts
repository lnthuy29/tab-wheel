import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { selectProfile } from 'src/app/store/profile/profile.selector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public constructor(private store: Store<AppState>) {}
  public ngOnInit() {
    this.store
      .select(selectProfile)
      .subscribe((profile) => {
        console.log('Logged in profile:', profile);
      });
  }
}
