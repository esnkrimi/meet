import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { selectGroupCats, selectSearchPool } from 'src/app/+state/select';
import { Router } from '@angular/router';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';

@Component({
  selector: 'app-search',
  standalone: false,

  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  searchPool: any = [];
  formSearch = new FormGroup({
    searchInput: new FormControl(''),
  });
  constructor(
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private store: Store,
    private router: Router,
    private dynamicVariableService: DynamicVariableService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  ngOnInit(): void {
    this.searchInputListener();
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
  gotoRouteWithDelay(route: any) {
    this.searchPool = [];
    this.dynamicVariableService.loadingProgressActiveation();
    setTimeout(() => {
      this.router.navigate([route]);
      this.dynamicVariableService.loadingProgressDeactiveation();
    }, 1000);
  }
  searchInputListener() {
    this.formSearch
      .get('searchInput')
      ?.valueChanges.pipe(
        tap((res: any) => {
          if (res.length > 0)
            this.loadingProgressDynamicService.loadingProgressActiveation(
              'change post type'
            );
          if (res.length === 0) this.searchPool = [];
        }),
        debounceTime(500)
        //  switchMap((e) =>  this.autocompleteSearch(e))
      )
      .subscribe((res: any) => {
        if (res.length > 0) this.autocompleteSearch(res);
        else this.autocompleteSearch('RESET123');
      });
  }

  autocompleteSearch(searchWord: any): any {
    return this.store.dispatch( 
      actions.prepareToSearchPostByWord({ word: searchWord })
    );
  }
}
