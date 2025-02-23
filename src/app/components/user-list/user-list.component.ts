import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UserListComponent implements OnInit, OnDestroy {
  users$!: Observable<User[]>;
  currentPage: number = 1;
  totalPages: number = 1;
  private queryParamsSub!: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      const page = +params['page'] || 1;
      this.userService.loadUsers(page);
    });
    this.users$ = this.userService.getUsers();

    this.subscriptions.push(
      this.userService.currentPage$.subscribe(page => this.currentPage = page),
      this.userService.totalPages$.subscribe(total => this.totalPages = total)
    );
  }

  ngOnDestroy(): void {
    this.queryParamsSub.unsubscribe();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  goToDetail(userId: number): void {
    this.router.navigate(['/users', userId]);
  }

  createUser(): void {
    this.router.navigate(['/users/new']);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.router.navigate([], { queryParams: { page: this.currentPage + 1 } });
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: this.currentPage - 1 } });
    }
  }
}

