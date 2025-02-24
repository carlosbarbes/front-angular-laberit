import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';
import { DefaultAvatarComponent } from "../../shared/default-avatar.component";

@Component({
  selector: 'app-user-detail',
  imports: [DefaultAvatarComponent],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent {
  @Input() user: User | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }

  edit(): void {
    this.editUser.emit();
  }
}