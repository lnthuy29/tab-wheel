import { createAction, props } from '@ngrx/store';
import { UserProfile } from 'src/app/models/profile.interface';

export const setUserProfile = createAction(
  '[Profile] Set',
  props<{ profile: UserProfile }>(),
);

export const clearUserProfile = createAction(
  '[Profile] Clear',
);
