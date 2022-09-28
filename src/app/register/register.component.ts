import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import Validation from '../user/confirm-password-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  maxDate!: Date;
  
  constructor(private router:Router,private formBuilder:FormBuilder,private userService:UserService,private toaster:ToastrService) {
    const currentYear = new Date();
    this.maxDate = new Date(currentYear);
    console.log(this.maxDate);
    console.log(currentYear);
   }
  
  "registerpatient":FormGroup;
  isSubmitted = false;
  role:string='user';
  ngOnInit(): void {    
    this.registerpatient= this.formBuilder.group({
      Title: new FormControl('',[Validators.required]),
      FirstName: new FormControl(null,[Validators.required,Validators.minLength(2)]),
      LastName: new FormControl(null,[Validators.required,Validators.minLength(2)]),
      Email: new FormControl(null,[Validators.required,Validators.email]),
      DateOfBirth: new FormControl(null,[Validators.required]),
      Password: new FormControl(null,[Validators.required,Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/
      ),Validators.minLength(8)]),
      Role:new FormControl('user'),
      ConfirmPassword:new FormControl(null,[Validators.required,Validators.minLength(8)]),
      ContactNumber: new FormControl(null,[Validators.required])      
    },
    {
      validators: [Validation.match('Password', 'ConfirmPassword')]
    }
    );
    this.registerpatient.reset();
   
  }
  patientregister(){
    if(this.registerpatient.valid){
      const control = this.registerpatient.get('Role');

      if(control instanceof FormControl){

        control.setValue('user');

      }
      //this.registerpatient.controls['Role'].value='user';
      console.log(this.role);
      console.log(this.registerpatient.value);
        this.userService.registerPatient(this.registerpatient.value)
      .subscribe((data: any) => {
        if (data.Succeeded == true) {
         // this.toasts.success('User registration successful');
         
        }
      });
      this.toaster.success("Patient Registered Successfully")
      console.log('Register Succeeded')
      this.registerpatient.reset();
      this.router.navigateByUrl("/login")
    }        
      else {
        this.validateAllFromFields(this.registerpatient);       
        
      }
  }


  private validateAllFromFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
     
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }
      else if(control instanceof FormGroup){
        this.validateAllFromFields(control)
      }
    })
  }
}
