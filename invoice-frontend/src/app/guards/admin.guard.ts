import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platform = inject(PLATFORM_ID);

  if (isPlatformBrowser(platform)) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      const userRole = typeof user.role === 'string' ? user.role.toLowerCase() : '';

      if (token && userRole === 'admin') return true;

      const payloadPart = token?.split('.')[1];
      if (payloadPart) {
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const tokenRole = JSON.parse(atob(paddedBase64)).role;

        if (typeof tokenRole === 'string' && tokenRole.toLowerCase() === 'admin') {
          return true;
        }
      }
    } catch (_err) {
      // Invalid locally stored data is treated as an unauthenticated session.
    }
  }

  router.navigate(['/overview']);
  return false;
};
