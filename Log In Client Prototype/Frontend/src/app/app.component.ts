import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  login() {
    this.http.get('/auth/login').subscribe((response: any) => {
      window.location.href = response;
    });
  }
}