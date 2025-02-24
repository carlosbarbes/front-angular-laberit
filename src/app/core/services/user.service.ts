import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://reqres.in/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();
  private lastId = 12;
  public fullUsers: User[] = [];
  private itemsPerPage = 6;
  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();
  private totalPagesSubject = new BehaviorSubject<number>(1);
  public totalPages$ = this.totalPagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers(1);
  }

  hasLocalData(): boolean {
    return this.fullUsers.length > 0;
  }

  loadUsers(page: number): void {
    this.currentPageSubject.next(page);
    forkJoin([
      this.http.get<{ data: User[] }>(`${this.apiUrl}?page=1`),
      this.http.get<{ data: User[] }>(`${this.apiUrl}?page=2`)
    ])
      .pipe(
        map(([response1, response2]) => [...response1.data, ...response2.data]),
        tap(allUsers => {
          this.fullUsers = this.sortUsers(allUsers);
          const totalPages = Math.ceil(this.fullUsers.length / this.itemsPerPage);
          this.totalPagesSubject.next(totalPages);
          const startIndex = (page - 1) * this.itemsPerPage;
          const pagedUsers = this.fullUsers.slice(startIndex, startIndex + this.itemsPerPage);
          this.usersSubject.next(pagedUsers);
        })
      )
      .subscribe();
  }

  sortUsers(allUsers: User[]): User[] {
    return [...allUsers].sort((a, b) => a.last_name.localeCompare(b.last_name));
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUser(id: number): Observable<User | undefined> {
    return new Observable(observer => {
      const user = this.fullUsers.find(u => u.id === id);
      observer.next(user);
      observer.complete();
    });
  }

  createUser(newUser: Partial<User>): void {
    this.http.post<any>(this.apiUrl, newUser)
      .pipe(
        tap(response => {
          const id = Number(response.id) || ++this.lastId;
          const user: User = {
            id,
            avatar: '',
            ...newUser
          } as User;
          this.fullUsers = this.sortUsers([...this.fullUsers, user]);
          const totalPages = Math.ceil(this.fullUsers.length / this.itemsPerPage);
          this.totalPagesSubject.next(totalPages);
          this.currentPageSubject.next(1);
          this.updateCurrentPage();
        })
      )
      .subscribe();
  }

  updateUser(id: number, updatedUser: Partial<User>): void {
    this.http.put<any>(`${this.apiUrl}/${id}`, updatedUser)
      .pipe(
        tap(response => {
          this.fullUsers = this.fullUsers.map(user =>
            user.id === id ? { ...user, ...updatedUser } : user
          );
          this.fullUsers = this.sortUsers(this.fullUsers);
          this.updateCurrentPage();
        })
      )
      .subscribe();
  }

  deleteUser(id: number): void {
    this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.fullUsers = this.fullUsers.filter(user => user.id !== id);
          const totalPages = Math.ceil(this.fullUsers.length / this.itemsPerPage);
          this.totalPagesSubject.next(totalPages);
          let currentPage = this.currentPageSubject.value;
          if (currentPage > totalPages) {
            currentPage = totalPages;
            this.currentPageSubject.next(currentPage);
          }
          this.updateCurrentPage();
        })
      )
      .subscribe();
  }

  private updateCurrentPage(): void {
    const currentPage = this.currentPageSubject.value;
    const startIndex = (currentPage - 1) * this.itemsPerPage;
    const pagedUsers = this.fullUsers.slice(startIndex, startIndex + this.itemsPerPage);
    this.usersSubject.next(pagedUsers);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPagesSubject.value) return;
    this.currentPageSubject.next(page);
    this.updateCurrentPage();
  }
}