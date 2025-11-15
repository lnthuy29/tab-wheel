import { filter, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { UserProfile } from '../models/profile.interface';
import { Nullable } from '../models/nullable.type';

export class ProfileHelper {
  public profile$: Observable<Nullable<UserProfile>>;
  public profile: Nullable<UserProfile> = null;

  public constructor(public store: Store<AppState>) {
    this.profile$ = this.store
      .select((state) => state.profile)
      .pipe(shareReplay(1));

    this.profile$.subscribe(
      (profile) => (this.profile = profile),
    );
  }
}
