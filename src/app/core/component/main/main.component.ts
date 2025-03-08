import { Component, effect, Inject, Injector, OnInit } from '@angular/core';
import { IPost } from 'src/app/+state/state';
import { Store } from '@ngrx/store';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LocalStorageService } from 'src/app/service/localstorage.service';
import { actions } from 'src/app/+state/action';
import {
  selectCategory,
  selectGroupCats,
  selectPost,
  selectSearchPool,
} from 'src/app/+state/select';
import { Router } from '@angular/router';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { map } from 'rxjs';
import { DialogueComponent } from 'src/libs/widgets/dialogue/dialogue.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  postDatas: IPost[] = [];
  sort = 'new';
  searchPool: any = [];
  componentSetting: any = {
    visualDirectives: {
      loadingProgressActive: true,
    },
    settingVariables: {
      offset: 0,
      groupCategory: 'all',
      groupCategoryName: 'all',
      typeOfPost: 'all',
      userLoginedEmail: '',
    },
  };
  groupCategoryName = '';
  loadingProgressDynamicVar = '';
  seed = 'public';
  constructor(
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private store: Store,
    private dynamicVariableService: DynamicVariableService,
    private injector: Injector,
    private router: Router,
    private loadingProgressDynamicService: LoadingProgressDynamicService,
    public localStorage: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.listenToSearchPool();
    this.fetchPostsAction(0, true);
    this.fetchPostsSelect();
    this.loadingGroupCategory();
    this.fetchUserLogined();
    this.changePathVariable();
    this.fetchFollowersAction();
    this.loadingProgressDynamicFetch();
  }
  sortData(v: any) {
    this.fetchPostsAction(0, true);
  }
  loadingProgressDynamicFetch() {
    this.loadingProgressDynamicService.loadingProgressActive.subscribe(
      (res) => {
        this.loadingProgressDynamicVar = res;
      }
    );
  }
  showBranches() {
    this.dynamicVariableService.showMenu.next(true);
  }
  fetchCategoryName() {
    this.store
      .select(selectGroupCats)
      .pipe(
        map((res) =>
          res.filter(
            (res) =>
              String(res.id) ===
              String(this.dynamicVariableService.groupCategory())
          )
        )
      )
      .subscribe((res: any) => {
        this.groupCategoryName = res[0]?.title;
      });
  }
  listenToSearchPool() {
    this.store.select(selectSearchPool).subscribe((res: any) => {
      this.searchPool = res;
      if (res[0]?.success === 'reset') this.searchPool = [];
      this.loadingProgressDynamicService.loadingProgressDeactiveation(200);
    });
  }

  fetchUserLogined() {
    this.componentSetting.settingVariables.userLoginedEmail = JSON.parse(
      this.localStorage.getItem('user')!
    )?.email;
    return JSON.parse(this.localStorage.getItem('user')!)?.email;
  }
  fetchPostsSelect() {
    this.store.select(selectPost).subscribe((res) => {
      this.postDatas = res;
      this.loadingProgressDynamicService.loadingProgressDeactiveation(200);
    });
  }
  changePathVariable() {
    this.dynamicVariableService.pathRoute.next('main');
  }
  fetchPostsAction(offset: number, fetchData: boolean) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    this.store.dispatch(
      actions.prepareFetchPosts({
        userEmail: JSON.parse(this.localStorage.getItem('user')!)?.email,
        offset: offset,
        typeOfPost: this.componentSetting?.settingVariables?.typeOfPost,
        groupId: this.componentSetting?.settingVariables?.groupCategory,
        sort: this.sort,
        restartFetchData: fetchData,
        seed: this.seed,
      })
    );
  }

  fetchFollowersAction() {
    this.store.dispatch(
      actions.prepareToFetchFollowers({
        user: JSON.parse(this.localStorage.getItem('user')!)?.email,
      })
    );
  }

  nextPagesLoad() {
    const tmp = this.componentSetting.settingVariables.offset;
    this.componentSetting.settingVariables.offset = tmp + 2;
    this.fetchPostsAction(this.componentSetting.settingVariables.offset, false);
  }
  resetSetting() {
    this.componentSetting = {
      visualDirectives: {
        loadingProgressActive: true,
      },
      settingVariables: {
        offset: 0,
        groupCategory: 'all',
        groupCategoryName: 'all',
        typeOfPost: 'all',
      },
    };
  }
  mySeed() {
    this.resetSetting();
    this.seed = 'mySeed';
    this.fetchPostsAction(0, true);
  }
  publicPosts() {
    this.resetSetting();
    this.seed = 'public';
    this.fetchPostsAction(0, true);
  }
  typeOfPostChange(typeOfPost: string) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    setTimeout(() => {
      this.store.dispatch(actions.clearPostArray());
      this.componentSetting = {
        visualDirectives: {
          loadingProgressActive: true,
        },
        settingVariables: {
          offset: 0,
          groupCategory: 'all',
          groupCategoryName: 'all',
          typeOfPost: typeOfPost,
        },
      };
      this.fetchPostsAction(0, true);
      //  this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
    }, 1000);
  }
  gotoRouteWithDelay(route: any) {
    this.dynamicVariableService.loadingProgressActiveation();
    setTimeout(() => {
      this.router.navigate([route]);
      //  this.dynamicVariableService.loadingProgressDeactiveation();
    }, 1000);
  }
  loadingGroupCategory() {
    effect(
      () => {
        this.fetchCategoryName();

        this.postDatas = [];
        this.store.dispatch(actions.clearPostArray());
        this.componentSetting = {
          visualDirectives: {
            loadingProgressActive: true,
          },
          settingVariables: {
            offset: 0,
            groupCategory: this.dynamicVariableService.groupCategory(),
            groupCategoryName: 'all',
            typeOfPost: 'all',
          },
        };
        this.fetchPostsAction(0, false);
      },
      { injector: this.injector }
    );
  }
}
