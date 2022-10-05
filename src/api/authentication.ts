import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { User } from './types';

export interface LoginDetails {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginDetails) {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const auth = getAuth();
  await signOut(auth);
}

export async function signUp({ email, password }: LoginDetails) {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(auth.currentUser!);
}

export async function resendEmailVerification() {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error('User not yet authenticated.');
  }
  await sendEmailVerification(auth.currentUser);
}

export async function deleteCurrentUser() {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error('No user currently authenticated');
  }
  await deleteUser(auth.currentUser);
}

export async function createUserProfile(userDetails: User) {
  await Promise.resolve();
  //TODO: implement
  return;
}
