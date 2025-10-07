import { Component, OnInit } from '@angular/core';
import { supabase } from '../../services/supabase-client';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent implements OnInit {
  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(2)]),
  });

  constructor(private router: Router) {}

  async ngOnInit() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      this.router.navigate(['/protected']);
    }
  }

  protected async onSubmit() {
    if (this.form.valid) {
      const { error } = await supabase.auth.signInWithPassword({
        email: this.form.value.email!,
        password: this.form.value.password!,
      });
    }
  }
}
