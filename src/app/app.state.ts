import { UserProfile } from './models/profile.interface';

export interface AppState {
  profile: UserProfile | null;
}
