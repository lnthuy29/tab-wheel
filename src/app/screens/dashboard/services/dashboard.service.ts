import { Injectable } from '@angular/core';
import { supabase } from '@supabase'; // your initialized Supabase client

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public async countUserGroups(
    userId: string,
  ): Promise<number> {
    const { count, error } = await supabase
      .from('group_members')
      .select('group_id', { count: 'exact' })
      .eq('profile_id', userId);

    if (error) {
      console.error(
        'Failed to count user groups:',
        error.message,
      );
      return 0;
    }

    return count || 0;
  }

  public async countUserLosingMatches(
    userId: string,
  ): Promise<number> {
    const { count, error } = await supabase
      .from('match_payers')
      .select('match_id', { count: 'exact' })
      .eq('profile_id', userId);

    if (error) {
      console.error(
        'Failed to count user losing matches:',
        error.message,
      );
      return 0;
    }

    return count || 0;
  }

  public async countUserMatches(
    userId: string,
  ): Promise<number> {
    const { count, error } = await supabase
      .from('match_participants')
      .select('match_id', { count: 'exact' })
      .eq('profile_id', userId);

    if (error) {
      console.error(
        'Failed to count user matches:',
        error.message,
      );
      return 0;
    }

    return count || 0;
  }

  public async getUserGroups(
    userId: string,
  ): Promise<any[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*, group_members!inner(profile_id)')
      .eq('group_members.user_id', userId);

    if (error) {
      console.error(
        ' Failed to fetch user groups:',
        error.message,
      );
      return [];
    }

    return data || [];
  }
}
