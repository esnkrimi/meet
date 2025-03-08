import { Component, Inject, OnInit } from '@angular/core';
import { IUser } from './+state/state';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from 'src/libs/widgets/dialogue/dialogue.component';
import { Store } from '@ngrx/store';
import { selectUser } from './+state/select';
import { actions } from './+state/action';
import { LocalStorageService } from './service/localstorage.service';
import { DynamicVariableService } from './service/dynamic.variables.services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  userLoginedObject: IUser | undefined;
  showMenu = false;
  componentSetting: any = {
    visualDirectives: {
      loadingProgressActive: false,
      routeFrom: '',
    },
    settingVariables: {
      offset: 0,
      groupCategory: 'all',
      typeOfPost: 'all',
    },
  };

  constructor(
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private store: Store,
    private dynamicVariableService: DynamicVariableService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {}
  showMenuListener() {
    this.dynamicVariableService.showMenu.subscribe(
      (res) => (this.showMenu = res)
    );
  }
  showWhatIsMyWebsite() {
  //  this.localStorageService?.clear()
    const showKnowUs = this.localStorageService?.getItem('showKnowUs');
    console.log(showKnowUs)
    if (showKnowUs !== 'no'){
      this.dialog.open(DialogueComponent, {
        data: { postId: 'knowUs' },
      });
    }
  }
  ngOnInit(): void {
    this.fetchUserLogined();
    this.fetchUserFromStorage();
    this.fetchLoadingProgressStatus();
    this.fetchIdFromRoute();
    this.showWhatIsMyWebsite();
    this.showMenuListener();
  }
  fetchIdFromRoute() {
    this.dynamicVariableService.pathRoute.subscribe((res) => {
      this.componentSetting = {
        visualDirectives: {
          loadingProgressActive: false,
          routeFrom: res,
        },
        settingVariables: {
          offset: 0,
          groupCategory: 'all',
          typeOfPost: 'all',
        },
      };
    });
  }

  fetchUserLogined() {
    this.store.select(selectUser).subscribe((user: IUser) => {
      if (user?.email?.length > 2) this.saveToStorage(user);
      this.userLoginedObject = user;
    });
  }
  saveToStorage(user: IUser) {
    this.localStorageService.setItem('user', JSON.stringify(user));
  }
  fetchUserFromStorage() {
    const user: any = this.localStorageService?.getItem('user');
    let userObject: any;
    if (user) {
      userObject = JSON.parse(user);
      userObject!.idToken = '';
    }
    if (userObject?.email?.length > 2) {
      this.store.dispatch(actions.login({ user: userObject }));
    }
  }
  fetchLoadingProgressStatus() {
    this.dynamicVariableService.loadingProgressActive.subscribe((res) => {
      this.componentSetting.visualDirectives.loadingProgressActive = res;
    });
  }
}
