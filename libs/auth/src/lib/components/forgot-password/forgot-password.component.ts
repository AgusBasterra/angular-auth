import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lib-auth-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly isLoading = this.authService.isLoading;

  readonly forgotForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const { email } = this.forgotForm.getRawValue();
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.successMessage.set('Si el email existe, recibirás instrucciones para restablecer tu contraseña.');
        this.forgotForm.reset();
      },
      error: (error) => {
        const message = error?.error?.message ?? 'Error al procesar la solicitud.';
        this.errorMessage.set(message);
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

