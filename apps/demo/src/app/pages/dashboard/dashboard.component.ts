import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@my-org/angular-auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>Dashboard</h1>
        <div class="user-info">
          <span>{{ auth.userName() }}</span>
          <button (click)="auth.logout()" class="btn btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main class="content">
        <div class="welcome-card">
          <h2>¡Bienvenido, {{ auth.user()?.name }}!</h2>
          <p>Email: {{ auth.user()?.email }}</p>
          
          @if (auth.user()?.emailVerified) {
            <span class="badge badge-verified">✓ Email Verificado</span>
          } @else {
            <span class="badge badge-unverified">Email no verificado</span>
          }

          @if (auth.user()?.roles && auth.user()!.roles!.length > 0) {
            <div class="roles">
              <strong>Roles:</strong>
              @for (role of auth.user()?.roles; track role) {
                <span class="badge">{{ role }}</span>
              }
            </div>
          }
        </div>

        <div class="actions">
          <button routerLink="/profile" class="btn btn-primary">
            Ver Perfil
          </button>
        </div>

        <div class="info-card">
          <h3>Estado de Autenticación</h3>
          <ul>
            <li>Autenticado: <strong>{{ auth.isAuthenticated() ? 'Sí' : 'No' }}</strong></li>
            <li>Cargando: <strong>{{ auth.isLoading() ? 'Sí' : 'No' }}</strong></li>
            <li>Email verificado: <strong>{{ auth.isEmailVerified() ? 'Sí' : 'No' }}</strong></li>
          </ul>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f3f4f6;
    }

    .header {
      background: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      margin: 0;
      color: #1a202c;
      font-size: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .content {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .welcome-card, .info-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }

    .welcome-card h2 {
      margin-top: 0;
      color: #667eea;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-right: 0.5rem;
    }

    .badge-verified {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-unverified {
      background: #fef3c7;
      color: #92400e;
    }

    .roles {
      margin-top: 1rem;
    }

    .roles .badge {
      background: #e0e7ff;
      color: #3730a3;
    }

    .actions {
      margin-bottom: 1.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-logout {
      background: #ef4444;
      color: white;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .info-card h3 {
      margin-top: 0;
    }

    .info-card ul {
      list-style: none;
      padding: 0;
    }

    .info-card li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .info-card li:last-child {
      border-bottom: none;
    }
  `],
})
export class DashboardComponent {
  protected readonly auth = inject(AuthService);
}

