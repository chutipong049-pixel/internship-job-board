import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://internship-job-board.onrender.com/api';

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials).pipe(
      catchError(() => {
        const fallbackUrl = this.baseUrl.replace('/api', '');
        return this.http.post<any>(`${fallbackUrl}/auth/login`, credentials);
      }),
      tap((res) => {
        const token = res?.token || res?.accessToken || res?.access_token;
        if (token) {
          localStorage.setItem('token', token);

          let userData = res.user;
          if (!userData) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              userData = {
                email: payload.email || credentials.email,
                name: payload.name || payload.username || credentials.email.split('@')[0]
              };
            } catch {
              userData = {
                email: credentials.email,
                name: credentials.email.split('@')[0]
              };
            }
          }

          localStorage.setItem('user', JSON.stringify(userData));
          this.currentUserSubject.next(userData);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, userData).pipe(
      catchError(() => {
        const fallbackUrl = this.baseUrl.replace('/api', '');
        return this.http.post<any>(`${fallbackUrl}/auth/register`, userData);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          email: payload.email || 'User',
          name: payload.name || payload.email?.split('@')[0] || 'User'
        };
      } catch {
        return { name: 'User' };
      }
    }
    return null;
  }
}