import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';

export const selectProfile = (state: {
  profile: Nullable<UserProfile>;
}) => state.profile;
