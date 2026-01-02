import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@my-org/angular-auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile">
      <header class="header">
        <button routerLink="/dashboard" class="btn btn-back">← Volver</button>
        <h1>Mi Perfil</h1>
        <button (click)="auth.logout()" class="btn btn-logout">
          Cerrar Sesión
        </button>
      </header>

      <main class="content">
        <div class="profile-card">
          <div class="avatar">
            {{ getInitials() }}
          </div>

          <h2>{{ auth.user()?.name }}</h2>
          <p class="email">{{ auth.user()?.email }}</p>

          <div class="info-grid">
            <div class="info-item">
              <label>ID</label>
              <span>{{ auth.user()?.id }}</span>
            </div>

            <div class="info-item">
              <label>Email Verificado</label>
              <span>{{ auth.isEmailVerified() ? 'Sí' : 'No' }}</span>
            </div>

            @if (auth.user()?.['createdAt']) {
              <div class="info-item">
                <label>Miembro desde</label>
                <span>{{ auth.user()?.['createdAt'] | date:'medium' }}</span>
              </div>
            }

            @if (auth.user()?.roles && auth.user()!.roles!.length > 0) {
              <div class="info-item full-width">
                <label>Roles</label>
                <div class="roles">
                  @for (role of auth.user()?.roles; track role) {
                    <span class="badge">{{ role }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <div class="debug-card">
          <h3>Datos Completos del Usuario</h3>
          <pre>{{ auth.user() | json }}</pre>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .profile {
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

    .content {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 3rem 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: bold;
      margin: 0 auto 1.5rem;
    }

    .profile-card h2 {
      margin: 0 0 0.5rem;
      color: #1a202c;
    }

    .email {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      text-align: left;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
    }

    .info-item span {
      color: #1a202c;
      font-weight: 500;
    }

    .roles {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      background: #e0e7ff;
      color: #3730a3;
    }

    .debug-card {
      background: #1a202c;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .debug-card h3 {
      margin-top: 0;
      color: white;
    }

    .debug-card pre {
      background: #2d3748;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      color: #e2e8f0;
      font-size: 0.875rem;
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

    .btn-back {
      background: #e5e7eb;
      color: #1a202c;
    }

    .btn-logout {
      background: #ef4444;
      color: white;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `],
})
export class ProfileComponent {
  protected readonly auth = inject(AuthService);

  getInitials(): string {
    const name = this.auth.user()?.name || this.auth.user()?.email || '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

