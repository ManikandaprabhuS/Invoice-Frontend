import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const clearInvalidSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const hasValidToken = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const payload = JSON.parse(atob(paddedBase64)) as { exp?: number };

    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platform = inject(PLATFORM_ID);

  if (isPlatformBrowser(platform)) {
    const token = localStorage.getItem('token');
    if (token && hasValidToken(token)) {
      return true;
    }

    if (token || localStorage.getItem('user')) {
      clearInvalidSession();
    }
  }

  return router.createUrlTree(['/login']);
};
