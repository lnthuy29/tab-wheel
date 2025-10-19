import { Nullable } from '../models/nullable.type';
import { UserProfile } from '../models/profile.interface';

export interface AppState {
  profile: Nullable<UserProfile>;
}
