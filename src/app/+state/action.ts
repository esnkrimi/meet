import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IComments, IPost, IUser, loginHandle } from './state';

export const actions = createActionGroup({
  source: 'store',
  events: {
    'fetch all message': props<{ message: any }>(),
    'prepare fetch all message': props<{ sender: any ,receiver:string}>(),
    'fetch message': props<{ message: any }>(),
    'prepare fetch message': props<{ email: any }>(),
    'send message': props<{ message: any; email: string; sender: any }>(),
    'delete post': props<{ datas: any }>(),
    'prepare delete post': props<{ id: any; email: any }>(),
    'delete comment': props<{ id: any; postId: any }>(),
    'prepare delete comment': props<{ id: any; postId: any }>(),
    'fetch user saved post': props<{ posts: any }>(),
    'prepare fetch user saved post': props<{ email: any }>(),
    'save post': props<{ userLoginedEmail: string; postId: number }>(),
    'null action': emptyProps(),
    'send mobile code': props<{ mobile: any }>(),
    'login via mobile': props<{ user: any }>(),
    'prepare to login via mobile': props<{ mobile: any; code: any }>(),
    'make category interrested': props<{ user: any }>(),
    'prepare to make category interrested': props<{
      user: string;
      catid: any;
      action: string;
    }>(),
    'submit comment on zoom': props<{ comment: IComments[]; postId: any }>(),
    'prepare to submit comment on zoom': props<{
      comment: any;
      postId: any;
      loginedId: any;
    }>(),
    'fetch post category': props<{ category: any }>(),
    'prepare to fetch post category': emptyProps(),
    'update profile': props<{ profileFields: any }>(),
    'prepare update profile': props<{ formObject: IUser }>(),
    'fetch posts of a user': props<{ post: any }>(),
    'prepare to fetch posts of a user': props<{ email: any }>(),
    'fetch user profile': props<{ user: any }>(),
    'prepare to fetch user profile': props<{ email: any }>(),
    'zoom post': props<{ post: any }>(),
    'prepare to zoom post': props<{ id: any }>(),
    'submit post': emptyProps(),
    'prepare to submit post': props<{ formValues: any; formData: any }>(),
    'submit comment': props<{ comment: IComments[]; postId: any }>(),
    'prepare to submit comment': props<{
      comment: any;
      postId: any;
      loginedId: any;
    }>(),
    'finish login': emptyProps(),
    'fetch group cats': props<{ groups: any }>(),
    'prepare to fetch group cats': emptyProps(),
    'fetch followers': props<{ follows: any }>(),
    'prepare to fetch followers': props<{ user: any }>(),
    'like post': props<{ userLoginedEmail: string; postId: number }>(),
    'clear post array': emptyProps(),
    'search post by word': props<{ post: IPost[] }>(),
    'prepare to search post by word': props<{ word: string }>(),
    login: props<{ user: IUser }>(),
    'fetch posts': props<{ posts: IPost[]; restartFetchData: boolean }>(),
    'prepare fetch posts': props<{
      userEmail: string;
      offset: number;
      typeOfPost: string;
      groupId: string;
      sort: string;
      restartFetchData: boolean;
      seed: string;
    }>(),
  },
});
