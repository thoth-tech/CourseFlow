import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{

  hide: boolean = true;
  
  forgotPasswordForm : FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email])
  })

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    
  }

  email : string = "";

  /* this method is called onClick, linked from auth services 
  check auth services file for more info */
  async forgotPassword() {
    try {
      this.email = this.forgotPasswordForm.value.username;
      this.authService.forgotPasssword(this.email);
      this.router.navigateByUrl('login');
    } catch (error) { 
      if (error === 'auth/user-not-found') 
      {
        alert('Error, Please ensure you have entered the correct email') 
      }
      console.log(error);} 
  }

}
