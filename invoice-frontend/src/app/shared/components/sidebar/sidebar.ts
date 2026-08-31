import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  @Output() close = new EventEmitter<void>();
  isAdmin = false;

  constructor(private router: Router) {
    this.isAdmin = this.readAdminRole();
  }

  private readAdminRole(): boolean {
    if (typeof localStorage === 'undefined') return false;

    try {
      const userRole = JSON.parse(localStorage.getItem('user') || '{}').role;
      if (typeof userRole === 'string' && userRole.toLowerCase() === 'admin') {
        return true;
      }

      const token = localStorage.getItem('token');
      if (!token) return false;

      const payloadPart = token.split('.')[1];
      if (!payloadPart) return false;

      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const tokenRole = JSON.parse(atob(paddedBase64)).role;

      return typeof tokenRole === 'string' && tokenRole.toLowerCase() === 'admin';
    } catch (_err) {
      return false;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

