import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, getAuth , signInWithPopup} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFireAuth) { }

  // Allows User to sign in using their google account
  async signInWithGoogle() {
    firebase.initializeApp(environment.firebaseConfig);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider); 
  }

  // Allows User to sign up fot their courseflow account
  registerWithEmailAndPassword(user : {email: string, password: string}){
    return this.afs.createUserWithEmailAndPassword(user.email, user.password);
  }

  // Allows User to sign in using their courseflow account
  signWithEmailAndPassword(user : {email: string, password: string}){
    return this.afs.signInWithEmailAndPassword(user.email, user.password);
  }

  // Create Doc to add user to database, this method can be modified to colect more user data
  // (phone number, address, etc.)
  async createUserDocFromAuth(userAuth: any, additionalData: any = {}) {
    const firebaseApp = firebase.initializeApp(environment.firebaseConfig);
    const db = getFirestore(firebaseApp);

    const userDocRef = doc(collection(db, 'users'), userAuth.user?.uid);
    console.log(userDocRef);

    const userSnapshot = await getDoc(userDocRef);
    console.log(userSnapshot);
    console.log(userSnapshot.exists());

    if (!userSnapshot.exists()) {
      const { displayName, email } = userAuth.user!;
      const createdAt = new Date();
      try {
        await setDoc(userDocRef, {
          displayName,
          email,
          createdAt,
          ...additionalData
        });
      } catch (error) {
        console.log('error creating ', error);
      }
    }

    return userDocRef;
  }

  // Allows User to reset their password
  forgotPasssword(email: string){
    return this.afs.sendPasswordResetEmail(email);
  }

  // Unfinished To be added New Method to allow user to verfy email
  /*
  sendEmailverification(user : any) {
    return user.sendEmailVerification();
  }
  */


  
}
