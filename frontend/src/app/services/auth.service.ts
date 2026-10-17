import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ชี้ไปยัง /api เสมอ ทั้ง Localhost และ Cloud บน Render
  private readonly baseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://internship-job-board.onrender.com/api';

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    const inputVal = (credentials.usernameOrEmail || credentials.email || credentials.username || '').trim();
    
    // เตรียม payload รองรับทั้งกรณีที่ backend ตรวจ email หรือ username
    const payload = {
      email: inputVal.includes('@') ? inputVal : `${inputVal}@example.com`,
      username: inputVal,
      password: credentials.password
    };

    // ยิงตรงเข้า /api/auth/login เสมอ
    return this.http.post<any>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap((res) => {
        const token = res?.token || res?.accessToken || res?.access_token;
        if (token) {
          localStorage.setItem('token', token);
        }

        let displayName = res?.user?.name || res?.user?.username || res?.name || res?.username;
        
        if (!displayName && token) {
          try {
            const jwtPayload = JSON.parse(atob(token.split('.')[1]));
            displayName = jwtPayload.name || jwtPayload.username || jwtPayload.email?.split('@')[0];
          } catch (e) {}
        }

        if (!displayName) {
          displayName = inputVal.includes('@') ? inputVal.split('@')[0] : inputVal;
        }

        const userData = {
          name: displayName || 'User',
          username: displayName || 'User',
          email: res?.user?.email || (inputVal.includes('@') ? inputVal : `${inputVal}@example.com`)
        };

        localStorage.setItem('user', JSON.stringify(userData));
        this.currentUserSubject.next(userData);
      })
    );
  }

  register(userData: any): Observable<any> {
    // ยิงตรงเข้า /api/auth/register เสมอ
    return this.http.post<any>(`${this.baseUrl}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('user');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value || this.getUserFromStorage();
  }

  public getUserFromStorage(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {}
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const jwtPayload = JSON.parse(atob(token.split('.')[1]));
        return {
          name: jwtPayload.name || jwtPayload.username || jwtPayload.email?.split('@')[0] || 'User',
          username: jwtPayload.username || jwtPayload.name || 'User',
          email: jwtPayload.email || 'User'
        };
      } catch (e) {
        return { name: 'User', username: 'User' };
      }
    }
    return null;
  }
}