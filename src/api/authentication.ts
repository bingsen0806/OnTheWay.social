import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useAppDispatch } from '../redux/hooks';
import { persistor } from '../redux/store';

export interface LoginDetails {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginDetails) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const auth = getAuth();
  signOut(auth);
}

export async function signUp({ email, password }: LoginDetails) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password);
}
