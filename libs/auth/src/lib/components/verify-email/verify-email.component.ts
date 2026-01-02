import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lib-auth-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly isLoading = signal(false);

  ngOnInit(): void {
    // Obtener token de los query params
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.errorMessage.set('Token de verificación no válido');
        return;
      }
      
      this.verifyEmail(token);
    });
  }

  private verifyEmail(token: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.successMessage.set('Email verificado exitosamente. Redirigiendo...');
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (error) => {
        const message = error?.error?.message ?? 'Error al verificar el email.';
        this.errorMessage.set(message);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}

