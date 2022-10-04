import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useAppDispatch } from '../redux/hooks';
import { persistor } from '../redux/store';

export interface LoginDetails {
  email: string;
  password: string;
}

const actionCodeSettings = {
  url: 'https://cs3216-final-group-9.firebaseapp.com/verified_email',
};

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
  await createUserWithEmailAndPassword(auth, email, password);
  sendEmailVerification(auth.currentUser!, actionCodeSettings);
}

export async function resendEmailVerification() {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error('User not yet authenticated.');
  }
  sendEmailVerification(auth.currentUser, actionCodeSettings);
}
