import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reactive',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './reactive.component.html',
  styles: ``
})
export class ReactiveComponent {

  submitedValue: any
  languageNames = ['Java', 'Javascript', 'Python', 'C', 'C++', 'C#']

  programmerForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormGroup({
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      lastName: new FormControl('')
    }),
    contact: new FormGroup({
      email: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl('')
    }),
    gender: new FormControl('Male'),
    languages: new FormArray([
      new FormControl(''),
      new FormControl(''),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false)
    ])
  })

  submitForm() {
    this.submitedValue = this.programmerForm.value
  }

  get languages() {
    return this.programmerForm.get('languages') as FormArray
  }

}
