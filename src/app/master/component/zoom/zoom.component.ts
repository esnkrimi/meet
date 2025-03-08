import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { actions } from 'src/app/+state/action';
import { selectSearchPool, selectZoom } from 'src/app/+state/select';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrl: './zoom.component.css',
})
export class ZoomComponent implements OnInit {
  data:any;
  constructor(private store: Store, private route: ActivatedRoute,
    private dynamicVariableService: DynamicVariableService,

  ) {}
  ngOnInit(): void {
    this.fetchZoomIDFromRoute();
    this.dynamicVariableService.pathRoute.next('main')
  }
  fetchZoomPoolAction(id: any) {
    this.store.dispatch(actions.prepareToZoomPost({ id: id }));
  }
  fetchZoomIDFromRoute() {
    this.route.paramMap.subscribe((res: any) => {
      this.fetchZoomPoolAction(res?.params?.id);
      this.fetchZoomPool(res?.params?.id)
    });
  }

  fetchZoomPool(postid:any) {
    this.store.select(selectZoom)
    .pipe(
      map(res=>res.filter(res=>res.id===postid))
    )
    .subscribe((r) => {
      this.data=r[r.length-1]
      this.dynamicVariableService.loadingProgressDeactiveation()
    });
  }
}
