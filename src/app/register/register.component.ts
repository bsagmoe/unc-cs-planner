import { Component, OnInit } from '@angular/core';
import { User, Year } from '../user' 
import { Http, Headers } from '@angular/http'
import { Router } from '@angular/router'
import { UserContextService } from '../services/user-context.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  constructor(private http: Http, 
              private userContextService: UserContextService,
              private router: Router) { }

  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  years: Year[] = [Year.First, Year.Second, Year.Third, Year.Fourth, Year.Fifth, Year.Other];
  model: User = new User();

  majors: string;
  minors: string;

  error: string;
  submitted: boolean = false;

  onSubmit(){
    console.log("calling onSubmit()");
    this.model.classInfo.majors = this.majors.split(",") || [];
    this.model.classInfo.minors = this.minors.split(",") || [];

    this.http.post('http://localhost:3000/register', 
                    JSON.stringify(this.model),
                    { headers: this.headers } )
              .toPromise().then(res => {
                console.log(res);
                this.userContextService.setCurrentUser(res.json());
                this.router.navigate(['/profile', res.json().username]);
              }).catch(res => {
                this.error = res.json().message;
              })
  }

  ngOnInit() {
    this.majors = "";
    this.minors = "";
    
    this.model.name = {
      first: null,
      last: null
    }

    this.model.classInfo = {
      year: null,
      class: null,
      majors: [],
      minors: []
    }

  }

  getYearString(year: Year){
    return Year[year].toString();
  }
}
