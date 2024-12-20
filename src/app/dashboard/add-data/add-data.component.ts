import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, Validators } from '@angular/forms';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';

@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent implements OnInit {


  constructor(private formbuilder: FormBuilder, public storeService: StoreService, private backendService: BackendService) { }
  public registrationForm: any;


  ngOnInit(): void {
    this.registrationForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      courseId: ['', Validators.required],
      email: ['', [Validators.email]],
      birthdate: [null, Validators.required],
      notifications: [false],
    })
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      this.backendService.addRegistration(formData, this.storeService.currentPage);
      this.registrationForm.reset();
      this.showAlertSuccess()
    } else {
      this.showAlertError();
    }
  }

  public alertMessageSuccess: string | null = null;
  public alertMessageError: string | null = null;

  showAlertSuccess() {
    this.alertMessageSuccess = 'course registered successfully';
    this.alertMessageError=null;
  }
  showAlertError() {
    this.alertMessageError = 'Please control your inputs';
    this.alertMessageSuccess=null;
  }

  closeAlert() {
    this.alertMessageSuccess = null;
    this.alertMessageError = null;
  }

}