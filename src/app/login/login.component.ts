import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router'
import { UserContextService } from '../services/user-context.service'
import { LoginModel } from '../form-models/login.model'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  

  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, 
              private userContextService: UserContextService,
              private router: Router) { }

  model: LoginModel = new LoginModel("","");
  error: string;

  ngOnInit() {

  }

  onSubmit(){
    console.log('logging in');
    this.http.post('http://localhost:3000/login',
                   JSON.stringify( { "username": this.model.username, "password": this.model.password} ),
                   {headers: this.headers})
              .toPromise().then(res => {
                this.userContextService.setCurrentUser(res.json());
                this.router.navigate(['/profile', res.json().username]);
              }).catch(res => {
                console.log(res.json());
                this.error = res.json().message;
              });
  }

}
