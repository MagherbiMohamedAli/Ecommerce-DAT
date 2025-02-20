import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  access_token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/auth/register`,
      data
    );
  }
  getCurrentUserFromToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.email.split('@')[0],
        role: payload.role
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  private loadUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          id: payload.sub,
          email: payload.email,
          name: payload.email.split('@')[0],
          role: payload.role
        };
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        this.loadUserFromToken();
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }
}