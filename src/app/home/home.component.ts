import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  reviews:boolean = false;
  submitReview:boolean = true;
  reviewForm:FormGroup;
  reviewData:any;
  reviewResponse:any;
  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  submitButton: boolean = false;
  public loading= false;

  constructor(private formBuilder:FormBuilder, private http:Http) { 
    this.reviewForm = formBuilder.group({
      url: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(this.emailRegex), Validators.required])]
    });
  }

  ngOnInit() {
  }


  submit() {

    if(this.reviewForm.valid) {
      this.submitButton = true;
    }

    if(this.submitButton) {
        this.loading = true;
        this.submitReview = true;
        this.reviewResponse = null;
        this.reviewData = null;
        this.reviews = false;
        let fb = this.reviewForm.value;
        console.log(fb);
        let requestUrl = fb.url;
        let email = fb.email;

        let requestParams = {
          "url": requestUrl,
          "emailAddress": email 
        }

        let url = "http://reviewshub.com.ng:8101/getcomments";
        
        this.http.post(url, requestParams, this.getHeader()).subscribe((response) => {
          let res = response.json();
          let data = res.data;
          console.log(res);
          this.reviewResponse = res.message;
          this.reviewData = data;
          if(this.reviewData == null) {
            this.reviewResponse = res.errorDescription;
            this.reviews = false;
          } else {
            this.reviews = true;
          }
        
          this.emptyForm();
          this.loading = false;
        }, (error) => {
          this.loading = false;
          this.reviewResponse = "Error retrieving records. Please check your internet connection or contact Administrator";
        })
      } else {
        this.reviewResponse = "Invalid request parameters. Please fill form again.";
        this.emptyForm();
      }
  }


  getHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');     
    return {headers: headers};
  }

  emptyForm() {
    this.reviewForm.controls.email.setValue("");
    this.reviewForm.controls.url.setValue("");
  }

}
