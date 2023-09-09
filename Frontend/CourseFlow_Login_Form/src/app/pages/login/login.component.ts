import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{

  hide: boolean = true;
  passwordControl:FormControl = new FormControl('', Validators.required)
  
  
  loginForm : FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required )
  })

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    
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

  /* this method is called onClick, linked from auth services 
  check auth services file for more info */
  async loginWithEmailAndPassword() {
    const userData = Object.assign(this.loginForm.value, {email: this.loginForm.value.username});
    console.log("Trying to log In: ", userData);
    
    try {
      const res = await this.authService.signWithEmailAndPassword(userData);
      this.router.navigateByUrl('home');
    } catch (error) {
      console.log(error);
      if (error === 'auth/user-not-found') {
        window.alert('*** User not found or has been deleted ***');
      } else if (error === 'auth/wrong-password') {
        window.alert('*** Invalid password ***');
      } else {
        window.alert('*** Unknown error ***');
      }
    }
  }

}
