import { Injectable } from '@angular/core';
import { supabase } from '@supabase';
import { EntityTable } from 'src/app/models/entity.enum';
import { Nullable } from 'src/app/models/nullable.type';
import { UserProfile } from 'src/app/models/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async getSession() {
    return await supabase.auth.getSession();
  }

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async getUser() {
    return await supabase.auth.getUser();
  }

  async getUserProfile(
    userId: string,
  ): Promise<Nullable<UserProfile>> {
    const { data, error } = await supabase
      .from(EntityTable.PROFILES)
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      displayName: data.display_name,
      avatarPath: data.avatar_path,
      employeeRoleId: data.employee_role_id,
      passwordChangedFirstTime:
        data.password_changed_first_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async validateCurrentPassword(
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

  async updatePasswordForLoggedInUser(newPassword: string) {
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
}
