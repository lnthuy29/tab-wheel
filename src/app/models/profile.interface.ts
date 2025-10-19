export interface UserProfile {
  id: string;
  displayName: string;
  avatarPath?: string;
  employeeRoleId: string;
  passwordChangedFirstTime: boolean;
  createdAt: string;
  updatedAt: string;
}
