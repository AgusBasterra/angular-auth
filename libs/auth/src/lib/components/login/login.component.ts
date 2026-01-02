import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AUTH_CONFIG } from '../../config/auth.tokens';

@Component({
  selector: 'lib-auth-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly config = inject(AUTH_CONFIG);

  // Signals
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = this.authService.isLoading;

  // Form
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Submit del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.errorMessage.set(null);

    this.authService.login(email, password).subscribe({
      error: (error) => {
        const message = error?.error?.message ?? 'Error al iniciar sesión. Verifica tus credenciales.';
        this.errorMessage.set(message);
      },
    });
  }

  /**
   * Navegar a registro
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Navegar a forgot password
   */
  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  /**
   * Verifica si el feature de registro está habilitado
   */
  get isRegisterEnabled(): boolean {
    return this.config.features?.registration ?? true;
  }

  /**
   * Verifica si el feature de password reset está habilitado
   */
  get isPasswordResetEnabled(): boolean {
    return this.config.features?.passwordReset ?? false;
  }
}

