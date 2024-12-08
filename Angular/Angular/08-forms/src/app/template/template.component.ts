import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NrcService } from '../model/services/nrc.service';
import { TemplateStudentListComponent } from './template-student-list/template-student-list.component';
import { Student } from '../model/type';
import { StudentService } from '../model/services/student.service';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-template',
  standalone: true,
  imports: [FormsModule, TemplateStudentListComponent, JsonPipe],
  templateUrl: './template.component.html',
  styles: ``
})
export class TemplateComponent {

  id = input<number>(0)
  studentFormObject = this.initStudent()

  codes: number[] = []

  selectedCode = signal<string>('')

  suffixes = computed(() => {
    if(!this.selectedCode()) {
      return this.service.getSuffixByCode(0, 'Eng')
    }
    return this.service.getSuffixByCode(+ this.selectedCode(), 'Eng')
  })
  types = ["FC", "AC", "NC"]

  constructor(private service: NrcService,
    private studentService: StudentService,
    private router: Router) {}

  ngOnInit() {
    this.codes = this.service.getDistinctCode()
    if(this.id()) {
      this.setEditInfo(this.studentService.findById(this.id()))
    }
  }

  submitStudentForm() {
    this.studentFormObject.code = this.selectedCode()
    this.studentService.save(this.studentFormObject).subscribe(resp => {
      if(resp) {
        alert("Saved student successfully.")
        this.router.navigate(['/template', 'students'])
      }
    })
  }

  change(event: any, key: string) {
    this.studentFormObject.subjects[key] = event.target.checked ? event.target.value : "";
  }

  private setEditInfo(student: Student) {
    this.studentFormObject.id = student.id as number
    this.studentFormObject.name = student.name
    this.studentFormObject.phone = student.phone
    this.studentFormObject.email = student.email

    this.selectedCode.set(student.nrc.substring(0, student.nrc.indexOf('/')))
    this.studentFormObject.suffix = student.nrc.substring(student.nrc.indexOf('/') + 1, student.nrc.indexOf('('))
    this.studentFormObject.type = student.nrc.substring(student.nrc.indexOf('(') + 1, student.nrc.indexOf(')'))
    this.studentFormObject.nrcNumber = student.nrc.substring(student.nrc.indexOf(')') + 1, student.nrc.length)

    this.studentFormObject.gender = student.gender

    this.studentFormObject.subjects['mya'] = student.subjects[0]
    this.studentFormObject.subjects['eng'] = student.subjects[1]
    this.studentFormObject.subjects['math'] = student.subjects[2]
    this.studentFormObject.subjects['che'] = student.subjects[3]
    this.studentFormObject.subjects['phy'] = student.subjects[4]

    if(student.subjects[5]) {
      if(student.subjects[5] == 'Biology') {
        this.studentFormObject.subjects['bio'] = student.subjects[5]
      }

      if(student.subjects[5] == 'Ecology') {
        this.studentFormObject.subjects['eco'] = student.subjects[5]
      }
    }
  }

  private initStudent() {
    let subjects: {[key: string]: any} = {}
    return {
      id: 0,
      name: '',
      phone: '',
      email: '',
      code: '',
      suffix: '',
      type: '',
      nrcNumber: '',
      subjects: subjects,
      gender: ''
    }
  }

}
