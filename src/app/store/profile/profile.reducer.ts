import {
  ActionReducer,
  createReducer,
  on,
} from '@ngrx/store';
import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';
import {
  clearUserProfile,
  setUserProfile,
} from './profile.action';

export const initialState: Nullable<UserProfile> = null;

export const profileReducer = createReducer(
  initialState as Nullable<UserProfile>,
  on(setUserProfile, (_, { profile }) => profile),
  on(clearUserProfile, () => null),
);
