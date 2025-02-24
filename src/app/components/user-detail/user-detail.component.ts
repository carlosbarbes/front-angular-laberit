import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  imports: [],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent {
  @Input() user: User | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }

  edit(): void {
    debugger;
    this.editUser.emit();
  }
}