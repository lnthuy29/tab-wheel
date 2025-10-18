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
}
