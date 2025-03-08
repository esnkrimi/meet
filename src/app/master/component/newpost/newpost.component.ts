import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { actions } from 'src/app/+state/action';
import { selectCategory, selectGroupCats } from 'src/app/+state/select';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LocalStorageService } from 'src/app/service/localstorage.service';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrl: './newpost.component.css',
})
export class NewpostComponent implements OnInit {
  [x: string]: any;
  @ViewChild('file') file: any;

  formNewPost = new FormGroup({
    group: new FormControl('1', Validators.required),
    title: new FormControl('', Validators.required),
    category: new FormControl(''),
    content: new FormControl('', Validators.required),
    typeOfPost: new FormControl('ask'),
  });
  @ViewChild('title') titleInput: ElementRef | undefined;
  @ViewChild('content') content: ElementRef | undefined;
  myFiles: any = [];
  groupCats: any = [];
  categories: any = [];
  allCategories: any = [];
  selectedCategory: any = [];
  selectedCategorySet: any = [];
  pageOfForm = 1;
  lockStep = false;
  loadingProgress: any;
  usePicture = false;
  constructor(
    private ng2ImgMaxService: Ng2ImgMaxService,
    private dynamicVariableService: DynamicVariableService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private store: Store,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  ngOnInit(): void {
    this.dynamicVariableService.loadingProgressDeactiveation();
    this.loadingProgressDynamicFetch();
    this.fetchGroupCatsAction();
    this.fetchGroupCats();
    this.fetchPostCategoriesAction();
    this.fetchPostCategoriesSelect();
    this.listenToFetchCategory();
  }
  loadingProgressDynamicFetch() {
    this.loadingProgressDynamicService.loadingProgressActive.subscribe(
      (res) => {
        this.loadingProgress = res;
      }
    );
  }
  pageNext() {
    this.pageOfForm = this.pageOfForm + 1;
    this.lockStep = false;
    this.showLoadingProgress();
  }
  showLoadingProgress() {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'step changed'
    );
    this.loadingProgressDynamicService.loadingProgressDeactiveation(500);
  }
  pagePrev() {
    this.pageOfForm = this.pageOfForm - 1;
    this.lockStep = false;
    this.showLoadingProgress();
  }
  isWordSimilar(word1: any, word2: any) {
    const sim1 = word1?.includes(word2);
    return sim1 > 0;
  }
  listenToFetchCategory() {
    this.formNewPost.get('category')?.valueChanges.subscribe((ch: any) => {
      this.categories = [];
      const tmp = this.allCategories?.filter((res: any) =>
        this.isWordSimilar(res.name, ch)
      );
      if (ch.length > 0) {
        this.categories = tmp.slice(0, 5);
      }
      if(this.categories.length===0){
        this.categories.push({name:ch})
      } 
    });
  }
  makeCategory(item: any) {
    this.selectedCategory.push(item);
    this.lockStep = true;
    this.selectedCategorySet = new Set(this.selectedCategory);
    this.formNewPost.get('category')?.setValue('');
  }
  checkContent() {
    const contentLength: any = this.formNewPost.get('content')?.value;
    if (contentLength.length > 10) this.lockStep = true;
    else this.lockStep = false;
  }
  fetchGroupCatsAction() {
    this.store.dispatch(actions.prepareToFetchGroupCats());
  }
  fetchGroupCats() {
    this.store.select(selectGroupCats).subscribe((res) => {
      this.groupCats = res;
    });
  }
  selectFile() {
    this.file.nativeElement.click();
  }
  onFileChange(event: any) {
    this.myFiles = [];
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].size > 1000000) {
        this.resizeImage(event.target.files[i]);
      } else this.myFiles.push(event.target.files[i]);
    }
    if (this.pageOfForm === 6) this.pageOfForm++;
    this.showLoadingProgress();
  }
  fetchPostCategoriesAction() {
    this.store.dispatch(actions.prepareToFetchPostCategory());
  }
  fetchPostCategoriesSelect() {
    this.store.select(selectCategory).subscribe((res) => {
      this.allCategories = res;
    });
  }
  resizeImage(file: File) {
    this.ng2ImgMaxService.compressImage(file, 0.5).subscribe(
      (result: any) => {
        this.myFiles.push(result);
      },
      (error) => {}
    );
  }
  checkInputLength(inputString: any) {
    this.lockStep =
      this.titleInput?.nativeElement.value.length > 3 ? true : false;
  }
  submitFile() {
    this.dynamicVariableService.loadingProgressActiveation();
    let user: any = this.localStorageService?.getItem('user');
    user = JSON.parse(user);
    const formData = new FormData();
    this.myFiles = this.myFiles.reverse();
    const tmp1: any = this.formNewPost.get('content')?.value;
    const tmp2: any = this.formNewPost.get('title')?.value;
    const formValues = {
      userid: user.email,
      groupid: this.formNewPost.get('group')?.value,
      typeOfPost: this.formNewPost.get('typeOfPost')?.value,
      content: encodeURIComponent(tmp1),
      title: encodeURIComponent(tmp2),
      category: Array.from(this.selectedCategorySet),
    };
    for (let i = 0; i < this.myFiles.length; i++) {
      formData.append('file[]', this.myFiles[i]);
    }

    this.store.dispatch(
      actions.prepareToSubmitPost({
        formValues: formValues,
        formData: formData,
      })
    );
    setTimeout(() => {
      this.dynamicVariableService.loadingProgressDeactiveation();
      this.pageOfForm = 0;
      this.router.navigate(['feature/profile/' + user.email + '/myPosts']);
      alert('successfull');
    }, 1500);
  }
  removeFromCategory(cat: string) {
    for (let i = 0; i < this.selectedCategory.length; i++) {
      if (cat === this.selectedCategory[i]) {
        this.selectedCategory[i] = '';
      }
    }
    const checkFilledSteps = this.selectedCategory.filter(
      (res: any) => res !== ''
    );
    if (checkFilledSteps.length === 0) this.lockStep = false;
    this.selectedCategorySet = new Set(this.selectedCategory);
  }
}
