import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../../services/supabase-client';

@Component({
  selector: 'app-redirect',
  template: '',
})
export class RedirectComponent implements OnInit {
  constructor(private router: Router) {}

  async ngOnInit() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      this.router.navigate(['/protected']);
    } else {
      this.router.navigate(['/log-in']);
    }
  }
}
