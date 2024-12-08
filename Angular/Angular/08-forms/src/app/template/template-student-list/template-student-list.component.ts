import { Component, effect, signal } from '@angular/core';
import { Student } from '../../model/type';
import { SubjectsPipe } from '../../model/pipes/subjects.pipe';
import { Location } from '@angular/common';
import { StudentService } from '../../model/services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-student-list',
  standalone: true,
  imports: [SubjectsPipe],
  templateUrl: './template-student-list.component.html',
  styles: ``
})
export class TemplateStudentListComponent {

  students: Student[] = []

  constructor(private location: Location,
    private router: Router,
    private studentService: StudentService) {

    effect(() => {
      this.students = this.studentService.findAll()
    })

  }

  editStudent(id: number | undefined) {
    this.router.navigate(['/template'], {queryParams: {id: id}})
  }

  deleteStudent(id: number | undefined) {}

  goBack() {
    this.location.back()
  }

}
