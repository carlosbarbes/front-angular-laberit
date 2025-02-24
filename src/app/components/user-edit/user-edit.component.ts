import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { SelectedUserService } from '../../core/services/selected-user.service';
import { User } from '../../models/user.model';
import { DefaultAvatarComponent } from "../../shared/default-avatar.component";

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, ReactiveFormsModule, DefaultAvatarComponent],
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  userId: number | null = null;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private selectedUserService: SelectedUserService
  ) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path;
    if (routePath === 'users/new') {
      this.isEditMode = false;
      this.selectedUserService.clear();
    } else if (routePath === 'users/edit') {
      const user = this.selectedUserService.getUser();
      if (user) {
        this.isEditMode = true;
        this.currentUser = user;
        this.userId = user.id;
        this.userForm.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        });
      } else {
        this.router.navigate(['/users']);
      }
    } else {
      this.router.navigate(['/users']);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      if (this.isEditMode && this.userId) {
        this.userService.updateUser(this.userId, formData);
      } else {
        this.userService.createUser(formData);
      }
      this.router.navigate(['/users']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  onDelete(): void {
    if (this.isEditMode && this.userId) {
      this.userService.deleteUser(this.userId);
      this.router.navigate(['/users']);
    }
  }
}