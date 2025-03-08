import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './component/profile/profile.component';
import { masterRouteModule } from './app.routes';
import { NewpostComponent } from './component/newpost/newpost.component';
import { MyProfileComponent } from './component/myprofile/myprofile.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LoginComponent } from './component/login/login.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { ZoomComponent } from './component/zoom/zoom.component';
import { UserInterrestsComponent } from './component/user-interrest/user-interrests.component';
import { ProfileMenuComponent } from './component/profile-menu/profile-menu.component';
import { MatBadgeModule } from '@angular/material/badge';
import { PostComponent } from 'src/libs/widgets/post/post.component';
import { FollowsComponent } from './component/follows/follows.component';
import { LoadingProgressDynamic } from 'src/libs/widgets/loading-progress-dynamic.component/loading-progress-dynamic.component';
import { WishlistComponent } from './component/wishlist/wishlist.component';
import { MypostsComponent } from './component/myposts/myposts.component';
import { MessageComponent } from './component/message/message.component';

@NgModule({
  declarations: [
    ProfileComponent,
    LoginComponent,
    NewpostComponent,
    MyProfileComponent,
    MessageComponent,
    ZoomComponent,
    UserInterrestsComponent,
    ProfileMenuComponent,
    FollowsComponent,
    MypostsComponent,
    WishlistComponent
  ],
  imports: [
    CommonModule,
    masterRouteModule,
    PostComponent,
    LoadingProgressDynamic,
    MatFormFieldModule,
    MatButtonModule,
    GoogleSigninButtonModule,
    MatBadgeModule,
    AngularEditorModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [ProfileMenuComponent, LoginComponent],
})
export class MasterModule {}
