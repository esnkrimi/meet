export const AppState: IState = {
  user: {
    email: '',
    firstName: '',
    lastName: '',
  },
  post: [],
  groupCats: [],
  searchPool: [],
  zoom: [],
  userProfile: [],
  postOfUser: [],
  category: [],
  follows: [],
  UserLoginedSavedPosts: [],
  message: [],
  allMessage: [],
};
export interface IUserLoginedSavedPosts {
  id: string;
  title: string;
  content: string;
  typeofpost: string;
  date: string;
}
export interface IState {
  userProfile: IUser[];
  postOfUser: IPost[];
  user: IUser;
  post: IPost[];
  groupCats: IGroupCats[];
  searchPool: IPost[];
  zoom: IPost[];
  category: IPostCategory[];
  follows: IFOllows[];
  message: IMessages[];
  allMessage: IAllMessages[];
  UserLoginedSavedPosts: IUserLoginedSavedPosts[];
}
export interface IGroupCats {
  title: string;
  id: string;
  count: string;
  active: string;
}
export interface IFOllows {
  id: number;
  follower: any;
  following: any;
}

export interface IUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  pass?: string;
  idToken?: string;
  name?: string;
  photoUrl?: string;
  provider?: string;
  job?: string;
  interrests?: IPostCategory[];
}
export interface loginHandle {
  email: string;
  pass: string;
}
export interface IPost {
  id: number;
  title: string;
  typeofpost: string;
  content: string;
  date: string;
  user: IUser;
  likes: ILikes[];
  saves: ISaved[];
  comments: IComments[];
  category: IPostCategory[];
}
export interface ISaved {
  id: number;
  useremail: string;
  expid: number;
  saved: string;
}
export interface IMessages {
  id: number;
  email: string;
  sender: number;
  message: string;
  icon: string;
}
export interface IAllMessages {
  id: number;
  email: string;
  sender: number;
  message: string;
  date: string;
}
export interface ILikes {
  id: number;
  userEmailDestination: string;
  expid: number;
  liked: string;
}
export interface IComments {
  id: number;
  comment: string;
  expid: number;
  userEmail?: string;
  userEmailDestination?: string;
  user?: any;
  likeCounter?: any;
}
export interface IPostCategory {
  id?: string;
  name: string;
}
