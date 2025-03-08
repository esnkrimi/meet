import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
})
export class ProfileMenuComponent {
  constructor(
    private dynamicVariableService: DynamicVariableService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  profileMenu = [
    {
      name: 'پروفایل',
      path: 'profile',
    },
    {
      name: 'جستجوی افراد',
      path: 'findOthers',
    },
    {
      name: 'ذخیره شده ها',
      path: 'wishlist',
    },
    {
      name: 'پست های من',
      path: 'myPosts',
    },
    {
      name: ' پیغام های من',
      path: 'message',
    },
    {
      name: 'فعالیت ها',
      path: 'myFollows',
    },
    {
      name: 'علاقه مندی ها',
      path: 'interrests',
    },
    {
      name: 'خروج',
      path: 'exit',
    },
  ];
  selectProfileFeature(path: string) {
    this.hideMenu();
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change profile setting'
    );
    setTimeout(() => {
      this.dynamicVariableService.pathRouteOfProfile.next(path);
    }, 500);
  }
  hideMenu() {
    this.dynamicVariableService.showProfileMenu.next(false);
  }
}
