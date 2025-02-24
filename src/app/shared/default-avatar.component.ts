import { Component } from '@angular/core';

@Component({
  selector: 'app-default-avatar',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-full text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4
           8 5.79 8 8s1.79 4 4 4z
           M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6"
      />
    </svg>
  `,
})
export class DefaultAvatarComponent {}
