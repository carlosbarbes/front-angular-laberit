import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { CommonModule, NgIfContext } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserDetailComponent } from "../user-detail/user-detail.component";
import { DefaultAvatarComponent } from "../../shared/default-avatar.component";
import { SelectedUserService } from '../../core/services/selected-user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  imports: [CommonModule, RouterModule, UserDetailComponent, DefaultAvatarComponent]
})
export class UserListComponent implements OnInit, OnDestroy {
  users$!: Observable<User[]>;
  currentPage: number = 1;
  totalPages: number = 1;
  selectedUser: User | null = null;
  private queryParamsSub!: Subscription;
  private subscriptions: Subscription[] = [];
  currentPageSubject: any;
  defaultAvatarList: TemplateRef<NgIfContext<string>> | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private selectedUserService: SelectedUserService
  ) { }

  ngOnInit(): void {
    if (!this.userService.hasLocalData()) {
      this.userService.loadUsers(1);
    }
    this.users$ = this.userService.getUsers();

    this.subscriptions.push(
      this.userService.currentPage$.subscribe(page => this.currentPage = page),
      this.userService.totalPages$.subscribe(total => this.totalPages = total)
    );
  }

  ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  goToDetail(userId: number): void {
    this.userService.getUser(userId).subscribe(user => {
      this.selectedUser = user || null;
    });
  }

  goToEdit(user: User): void {
    this.selectedUserService.setUser(user);
    this.router.navigate(['/users/edit']);
  }

  createUser(): void {
    this.selectedUserService.clear();
    this.router.navigate(['/users/new']);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.userService.setPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.userService.setPage(this.currentPage - 1);
    }
  }
}