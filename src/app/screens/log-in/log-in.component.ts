import { Component, OnInit } from '@angular/core';
import { supabase } from '../../services/supabase-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './log-in.component.html',
})
export class LogInComponent implements OnInit {
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private router: Router) {}

  async ngOnInit() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      this.router.navigate(['/protected']);
    }
  }

  async login() {
    const { error } = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password,
    });

    this.message = error ? error.message : 'Login successful!';
  }
}
