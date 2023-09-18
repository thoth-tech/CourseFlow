import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit{
  hide: boolean = true;
  hideConfirmPassword: boolean = true;
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  })
  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    
  }

  /* this method is called onClick, linked from auth services 
  check auth services file for more info */
  async RegisterWithEmailAndPassword(){
    const userData = Object.assign(this.registerForm.value, {email: this.registerForm.value.username});
    if (userData.password !== userData.confirmPassword){
      window.alert("Passwords do not match");
      return;
    }
    try {
      const res = await this.authService.registerWithEmailAndPassword(userData);
      // now verify user email
      await this.authService.sendEmailForVerification(res.user!);
      // this will be new email verification page soon
      this.router.navigateByUrl('forgot-password/verification-page-fg');
      // user can click login at verification page once they have verified your email
      await this.authService.createUserDocFromAuth(res, {phoneNumber: userData.phoneNumber});
    } catch (error) {
      console.log(error);
    }
  }

  /* this method is called onClick, linked from auth services 
  check auth services file for more info */
  async logInWithGoogle(){
    try {
      const res = await this.authService.signInWithGoogle();
      await this.authService.createUserDocFromAuth(res);
      this.router.navigateByUrl('home');
    } catch (error) {
      console.log(error);
    }
  }

}
