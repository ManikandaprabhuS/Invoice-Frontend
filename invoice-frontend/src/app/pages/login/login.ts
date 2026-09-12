import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.generated';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authUrl = `${environment.apiBaseUrl}/auth`;
  userName = '';
  password = '';
  emailId = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  resetToken = '';
  submitting = false;
  showError = false;
  mode: 'login' | 'forgot' | 'otp' | 'reset' = 'login';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    this.showError = false;
    if (!this.userName || !this.password) {
      this.showError = true;
      return;
    }
    this.http.post<any>(`${this.authUrl}/login`, {
      userName: this.userName.trim(),
      password: this.password

    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/overview']);
      },
      error: (err) => {
        alert(
          err.status === 0
            ? 'Unable to connect to the login server. Please try again shortly.'
            : err.error?.message || 'Invalid username or password'
        );
      }
    });
  }

  forgotPassword() {
    const emailId = this.emailId.trim().toLowerCase();
    if (!this.isValidEmail(emailId)) {
      alert('Please enter a valid email address');
      return;
    }
    if (this.submitting) return;
    this.submitting = true;
    this.http.post<any>(`${this.authUrl}/forgot-password`, {
      emailId
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.emailId = emailId;
        this.otp = '';
        alert(res.message);
        this.mode = 'otp';
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.message || 'Failed to send OTP');
      }
    });
  }

  verifyOtp() {
    const otp = this.otp.trim();
    if (!/^\d{6}$/.test(otp)) {
      alert('Please enter the 6-digit OTP');
      return;
    }
    if (this.submitting) return;
    this.submitting = true;
    this.http.post<any>(`${this.authUrl}/verify-reset-otp`, {
      emailId: this.emailId,
      otp
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.resetToken = res.resetToken;
        this.newPassword = '';
        this.confirmPassword = '';
        this.mode = 'reset';
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.message || 'OTP verification failed');
      }
    });
  }

  resetPassword() {
    if (!this.resetToken || !this.newPassword || !this.confirmPassword) {
      alert('Please enter and confirm your new password');
      return;
    }
    if (this.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (this.submitting) return;
    this.submitting = true;
    this.http.post<any>(`${this.authUrl}/reset-password`, {
      emailId: this.emailId,
      resetToken: this.resetToken,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        alert(res.message);
        this.clearResetFlow();
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.message || 'Reset failed');
      }
    });
  }

  changeMode(newMode: 'login' | 'forgot' | 'otp' | 'reset') {
    this.mode = newMode;
    this.showError = false;
    if (newMode === 'login') this.clearResetFields();
  }

  private clearResetFlow(): void {
    this.mode = 'login';
    this.password = '';
    this.clearResetFields();
  }

  private clearResetFields(): void {
    this.emailId = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.resetToken = '';
  }

  private isValidEmail(emailId: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId);
  }
}
