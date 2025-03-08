import { SimpleChanges } from '@angular/core';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';
import {
  selectFollows,
  selectPost,
  selectUserLoginedSavedPosts,
} from 'src/app/+state/select';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LocalStorageService } from 'src/app/service/localstorage.service';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrl: './myposts.component.css',
})
export class MypostsComponent implements OnChanges {
  @Input() posts: any;
  constructor(
    private store: Store,
    private router: Router,
    private dynamicVariableService: DynamicVariableService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
  }
  deletePost(post: any, index: any) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change profile setting'
    );
    this.store.dispatch(
      actions.prepareDeletePost({ id: post?.id, email: post?.user?.email })
    );
    setTimeout(() => {
      this.actionFetchPostOfAUser(post?.user?.email);
    }, 1000);
    this.loadingProgressDynamicService.loadingProgressDeactiveation(1500);
  }
  shortcase(content: any) {
    return content.substring(1, 1000) + ' ... ';
  }

  actionFetchPostOfAUser(email: string) {
    this.store.dispatch(actions.prepareToFetchPostsOfAUser({ email: email }));
  }
  gotoRouteWithDelay(route: any) {
    this.dynamicVariableService.loadingProgressActiveation();
    setTimeout(() => {
      this.router.navigate([route]);
      this.dynamicVariableService.loadingProgressDeactiveation();
    }, 1000);
  }
  otDateTime(timestamp: any) {
    return (
      timestamp.substring(0, 4) +
      '/' +
      timestamp.substring(4, 6) +
      '/' +
      timestamp.substring(6, 8) +
      ' ' +
      timestamp.substring(8, 10) +
      ':' +
      timestamp.substring(10, 12)
    );
  }
}
