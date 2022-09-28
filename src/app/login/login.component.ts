import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseModel } from '../models/responseModel';
import { ResponsiveService } from '../responsive/responsive.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private formBuilder: FormBuilder, private service: UserService, private responsive: ResponsiveService) { }
  "loginForm": FormGroup;
  isLoginError: boolean = false;
  deviceXs!: boolean;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });

    this.deviceXs = this.responsive.devicesXs;
    console.log(this.deviceXs);
  }

  login() {
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe((data: ResponseModel) => {
        if (data.responseCode == 1) {
          localStorage.setItem('userToken', JSON.stringify(data.dateSet.token));

          localStorage.setItem('userID', JSON.stringify(data.dateSet.id));
          
          if (!data.dateSet.isPasswordChanged) {
            this.router.navigate(['/change-password']);
          }
          
          else {
            console.log(data.dateSet.roles);
            if (data.dateSet.roles[0] == "user")
            this.router.navigate(['/dashboard']);
            if (data.dateSet.roles[0] == "nurse")
              this.router.navigate(['/dashboard']);
            if (data.dateSet.roles[0] == "physician")
              this.router.navigate(['/dashboard']);
            if (data.dateSet.roles[0] == "admin")
             this.router.navigate(['/dashboard']);
          }
        }
        else {
          console.log(data.responseMessage);
        }
      },
       (err => {
          console.log(err);
        }));
    }
    else {
      this.validateAllFromFields(this.loginForm);
    }
  }

  // logout(){
  //   this.service.logout();
  //   this.router.navigateByUrl("/login");

  // }
  register() {
    this.router.navigate(['/register']);
  }
  private validateAllFromFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      }
      else if (control instanceof FormGroup) {
        this.validateAllFromFields(control)
      }
    })
  }

}