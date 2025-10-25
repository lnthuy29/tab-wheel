import { Injectable } from '@angular/core';
import { supabase } from '@supabase';
import { UserResponse } from '@supabase/supabase-js';
import { EntityTable } from 'src/app/models/entity.enum';
import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';
import {
  toCamelCaseObject,
  toSnakeCaseObject,
} from '../utilities/naming-convention.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public async getSession() {
    return await supabase.auth.getSession();
  }

  public async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  public async getUser(): Promise<UserResponse> {
    return await supabase.auth.getUser();
  }

  public async getUserProfile(
    userId: string,
  ): Promise<Nullable<UserProfile>> {
    const { data, error } = await supabase
      .from(EntityTable.PROFILES)
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    const profile = toCamelCaseObject<UserProfile>(data);

    return profile;
  }

  public async validateCurrentPassword(
    currentPassword: string,
  ): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const email = user?.email;

    if (!email) {
      return false;
    }

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

    if (error) {
      return false;
    }

    return true;
  }

  public async updatePasswordForLoggedInUser(
    newPassword: string,
  ) {
    const { data: userUpdateData, error: userUpdateError } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (userUpdateError) {
      return { data: null, error: userUpdateError };
    }

    const userId = userUpdateData.user?.id;

    if (userId) {
      const { error: profileUpdateError } = await supabase
        .from(EntityTable.PROFILES)
        .update({ password_changed_first_time: true })
        .eq('id', userId);

      if (profileUpdateError) {
        console.error(
          'Failed to update password_changed_first_time:',
          profileUpdateError,
        );
      }
    }

    return { data: userUpdateData, error: null };
  }

  public async updateUserProfile(
    updates: Partial<UserProfile>,
  ): Promise<{ data: Nullable<UserProfile>; error: any }> {
    const filtered: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null) {
        filtered[key] = value;
      }
    }

    const payload = toSnakeCaseObject(filtered);

    const { data, error } = await supabase
      .from(EntityTable.PROFILES)
      .update(payload)
      .eq('id', updates.id)
      .select('*')
      .single();

    if (error || !data) {
      console.error('Failed to update profile:', error);
      return { data: null, error };
    }

    const updatedProfile: UserProfile = {
      id: data.id,
      displayName: data.display_name,
      avatarPath: data.avatar_path,
      employeeRoleId: data.employee_role_id,
      passwordChangedFirstTime:
        data.password_changed_first_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: updatedProfile, error: null };
  }
}
