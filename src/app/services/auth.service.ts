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

  public async signUp(
    email: string,
    password: string,
    profile?: Partial<UserProfile>,
  ): Promise<{ data: Nullable<UserProfile>; error: any }> {
    try {
      // Step 1: Create account in Supabase Auth
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            // The redirect URL after email confirmation
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

      if (signUpError) {
        console.error('Sign-up failed:', signUpError);
        return { data: null, error: signUpError };
      }

      const user = signUpData.user;
      if (!user) {
        // No user yet, waiting for email verification
        return {
          data: null,
          error: null,
        };
      }

      // Step 2: Create profile record (optional)
      const newProfile = {
        id: user.id,
        email: user.email,
        displayName: profile?.displayName ?? '',
      };

      const payload = toSnakeCaseObject(newProfile);

      const { data, error } = await supabase
        .from(EntityTable.PROFILES)
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        console.error(
          'Failed to create user profile:',
          error,
        );
        return { data: null, error };
      }

      const createdProfile =
        toCamelCaseObject<UserProfile>(data);

      return { data: createdProfile, error: null };
    } catch (err) {
      console.error('Failed to sign up:', err);
      return { data: null, error: err };
    }
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
        console.error(profileUpdateError);
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

    const updatedProfile: UserProfile =
      toCamelCaseObject(data);

    return { data: updatedProfile, error: null };
  }

  public async uploadAvatar(
    profile: Pick<
      UserProfile,
      'id' | 'avatarPath' | 'displayName'
    >,
    file: File,
  ): Promise<{ data: Nullable<UserProfile>; error: any }> {
    try {
      const fileExtension = file.name.split('.').pop();

      const sanitizedPrefix = profile.displayName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '')
        .toLowerCase();

      const timestamp = new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, '');

      const fileName = `${sanitizedPrefix}-${timestamp}.${fileExtension}`;
      const filePath = `avatars/${fileName}`;

      // Upload new avatar to 'users' bucket
      const { error: uploadError } = await supabase.storage
        .from('users')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(
          'Failed to upload avatar:',
          uploadError,
        );
        return { data: null, error: uploadError };
      }

      // Delete old avatar if exists and not default
      if (
        profile.avatarPath &&
        !profile.avatarPath.includes('default-avatar')
      ) {
        try {
          const storagePrefix =
            '/storage/v1/object/public/users/';
          let oldFilePath: string | null = null;

          try {
            // Try to parse absolute URLs
            const url = new URL(profile.avatarPath);
            const pathname = url.pathname;
            const index = pathname.indexOf(storagePrefix);
            if (index !== -1) {
              oldFilePath = pathname.substring(
                index + storagePrefix.length,
              );
            }
          } catch {
            // Fallback for relative paths
            if (
              profile.avatarPath.includes(storagePrefix)
            ) {
              oldFilePath = profile.avatarPath.substring(
                profile.avatarPath.indexOf(storagePrefix) +
                  storagePrefix.length,
              );
            }
          }

          // If found and it’s not the same as the new file
          if (oldFilePath && oldFilePath !== filePath) {
            const { error: deleteError } =
              await supabase.storage
                .from('users')
                .remove([oldFilePath]);

            if (deleteError) {
              console.warn(
                'Failed to delete old avatar:',
                deleteError,
              );
            }
          }
        } catch (deleteEx) {
          console.warn(
            'Unexpected error occurred while deleting old avatar:',
            deleteEx,
          );
        }
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('users')
        .getPublicUrl(filePath);

      const publicUrl =
        publicUrlData?.publicUrl ?? filePath;

      // Update user profile in the database
      const { data: profileData, error: updateError } =
        await supabase
          .from(EntityTable.PROFILES)
          .update({ avatar_path: publicUrl })
          .eq('id', profile.id)
          .select('*')
          .single();

      if (updateError || !profileData) {
        console.error(
          'Failed to update avatar path:',
          updateError,
        );
        return { data: null, error: updateError };
      }

      const updatedProfile =
        toCamelCaseObject<UserProfile>(profileData);
      return { data: updatedProfile, error: null };
    } catch (error) {
      console.error(
        'Unexpected error occurred while uploading avatar:',
        error,
      );
      return { data: null, error };
    }
  }

  public async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Failed to sign out:', error);
      return { error };
    }

    return { error: null };
  }
}
