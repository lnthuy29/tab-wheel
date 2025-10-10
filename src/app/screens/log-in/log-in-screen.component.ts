import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { supabase } from '@supabase';

@Component({
  selector: 'app-log-in-screen',
  templateUrl: './log-in-screen.component.html',
  styleUrl: './log-in-screen.component.scss',
})
export class LogInScreenComponent implements OnInit {
  protected form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  public constructor(
    private router: Router,
    private toastr: ToastrService,
  ) {}

  public async ngOnInit(): Promise<void> {
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

      if (error) {
        this.toastr.error(error.message, undefined, {
          timeOut: 3000,
          progressBar: true,
          positionClass: 'toast-bottom-center',
        });
      } else {
        this.router.navigate(['/protected']);
      }
    }
  }
}
