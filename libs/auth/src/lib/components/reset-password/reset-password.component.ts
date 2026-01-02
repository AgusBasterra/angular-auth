import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lib-auth-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly isLoading = this.authService.isLoading;
  readonly token = signal<string | null>(null);

  readonly resetForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: this.passwordMatchValidator,
  });

  ngOnInit(): void {
    // Obtener token de los query params
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.errorMessage.set('Token de restablecimiento no válido');
      }
      this.token.set(token);
    });
  }

  private passwordMatchValidator(form: any) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token()) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { newPassword } = this.resetForm.getRawValue();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.resetPassword(this.token()!, newPassword).subscribe({
      next: () => {
        this.successMessage.set('Contraseña restablecida exitosamente. Redirigiendo...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        const message = error?.error?.message ?? 'Error al restablecer la contraseña.';
        this.errorMessage.set(message);
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

