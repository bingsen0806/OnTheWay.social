import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export interface LoginDetails {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginDetails) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password);
}
