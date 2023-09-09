import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'firebase/auth';

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
      console.log(userData);
      this.router.navigateByUrl('login');
      await this.authService.createUserDocFromAuth(res, {phoneNumber: userData.phoneNumber});
    } catch (error) {
      console.log(error);
    }
  }

}
