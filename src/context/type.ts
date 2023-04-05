import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export interface IAuthProps {
  currentUser: firebase.User;
  logout(): Promise<any>;
  loading: boolean;
  signup(email: string, password: string): Promise<any>;
  login(email: string, password: string): Promise<any>;
  userInfo: firebase.UserInfo;
}
