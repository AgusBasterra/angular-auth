import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lib-auth-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Signals
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = this.authService.isLoading;

  // Form
  readonly registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: this.passwordMatchValidator,
  });

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  private passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  /**
   * Submit del formulario de registro
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.getRawValue();
    this.errorMessage.set(null);

    this.authService.register(email, password, { name }).subscribe({
      error: (error) => {
        const message = error?.error?.message ?? 'Error al registrarse. Intenta nuevamente.';
        this.errorMessage.set(message);
      },
    });
  }

  /**
   * Navegar a login
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

