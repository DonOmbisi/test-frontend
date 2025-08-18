import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
    <div class="app-container">
      <!-- Modern Gradient Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-icon">
              <mat-icon>school</mat-icon>
            </div>
            <h1 class="app-title">Student Data Processor</h1>
            <span class="app-subtitle">Advanced Analytics Platform</span>
          </div>
          
          <!-- Navigation Menu -->
          <nav class="nav-menu">
            <a 
              mat-button 
              routerLink="/data-generation" 
              routerLinkActive="active"
              class="nav-link"
              [class.active]="isActive('/data-generation')">
              <mat-icon>add_circle</mat-icon>
              <span>Data Generation</span>
            </a>
            <a 
              mat-button 
              routerLink="/data-processing" 
              routerLinkActive="active"
              class="nav-link"
              [class.active]="isActive('/data-processing')">
              <mat-icon>transform</mat-icon>
              <span>Data Processing</span>
            </a>
            <a 
              mat-button 
              routerLink="/database" 
              routerLinkActive="active"
              class="nav-link"
              [class.active]="isActive('/database')">
              <mat-icon>storage</mat-icon>
              <span>Database</span>
            </a>
            <a 
              mat-button 
              routerLink="/reports" 
              routerLinkActive="active"
              class="nav-link"
              [class.active]="isActive('/reports')">
              <mat-icon>assessment</mat-icon>
              <span>Reports</span>
            </a>
          </nav>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Floating Action Button for Quick Actions -->
      <button class="fab" mat-fab color="accent" (click)="showQuickActions()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
    styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow-x: hidden;
    }

    .app-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 80px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
    }

    .logo-icon mat-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .app-title {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .app-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 400;
      margin-left: 8px;
    }

    .nav-menu {
      display: flex;
      gap: 8px;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.9) !important;
      text-decoration: none;
      padding: 12px 20px !important;
      border-radius: 12px !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.5s;
    }

    .nav-link:hover::before {
      left: 100%;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      color: white !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .nav-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .main-content {
      flex: 1;
      padding: 32px 24px;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
    }

    .fab {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .fab:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        padding: 20px 24px;
      }

      .nav-menu {
        flex-wrap: wrap;
        justify-content: center;
      }

      .app-title {
        font-size: 24px;
      }
    }

    @media (max-width: 768px) {
      .nav-menu {
        gap: 4px;
      }

      .nav-link {
        padding: 8px 12px !important;
        font-size: 14px;
      }

      .nav-link span {
        display: none;
      }

      .nav-link mat-icon {
        margin: 0;
      }

      .app-title {
        font-size: 20px;
      }

      .app-subtitle {
        display: none;
      }
    }

    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .main-content {
      animation: fadeInUp 0.6s ease-out;
    }
  `]
})
export class AppComponent {
  title = 'Student Data Processor';

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }

  showQuickActions() {
    // TODO: Implement quick actions menu
    console.log('Quick actions clicked');
  }
}
