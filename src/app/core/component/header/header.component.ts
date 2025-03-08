import {
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { DialogueComponent } from 'src/libs/widgets/dialogue/dialogue.component';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() userLoginedObject: any;
  homeWaitRoute = false;
  constructor(
    private dynamicVariableService: DynamicVariableService,
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private dialog: MatDialog,
    private router: Router
  ) {}
  activeLoginModal() {
    const dialogRef = this.dialog.open(DialogueComponent, {
      data: { postId: 'mustLogin', poolType: 'main' },
    });
  }
  gotoRouteWithDelay(route: any) {
    this.dynamicVariableService.loadingProgressActiveation();

    this.homeWaitRoute=true
    setTimeout(() => {
      this.router.navigate([route])
    }, 1000);
  }
  goHome() {
    this.homeWaitRoute = true;
    this.gotoRouteWithDelay('');
  }
}
