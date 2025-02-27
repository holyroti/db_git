import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000/api/authenticate';

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      map((response) => {
        // Pass the entire user object to session storage
        return {
          success: response.success,
          user: response.user,
        };
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/register', user); // Update to match backend route
  }
  

}

