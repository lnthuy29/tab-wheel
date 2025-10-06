import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { supabase } from '../services/supabase-client';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      return true;
    } else {
      this.router.navigate(['/log-in']);
      return false;
    }
  }
}
