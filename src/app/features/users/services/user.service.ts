import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  private usersSubject = new BehaviorSubject<User[]>([]);
  private users$ = this.usersSubject.asObservable();
  private isLoaded = false;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    if (!this.isLoaded) {
      this.loadUsers();
    }
    return this.users$;
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      tap((newUser) => {
        // Add to local state
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
      })
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user).pipe(
      tap((updatedUser) => {
        // Update local state
        const currentUsers = this.usersSubject.value;
        const index = currentUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this.usersSubject.next([...currentUsers]);
        }
      })
    );
  }

  deleteUser(id: number): Observable<{}> {
    return this.http.delete<{}>(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => {
        // Remove from local state
        const currentUsers = this.usersSubject.value;
        const filteredUsers = currentUsers.filter((u) => u.id !== id);
        this.usersSubject.next(filteredUsers);
      })
    );
  }

  private loadUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe((users) => {
      this.usersSubject.next(users);
      this.isLoaded = true;
    });
  }
}
