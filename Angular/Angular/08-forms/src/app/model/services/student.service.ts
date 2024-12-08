import { Injectable } from "@angular/core";
import { Student } from "../type";
import { of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class StudentService {

  private database: Student[] = []

  save(form: any) {
    let {id, ...value} = form

    const student: Student = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      nrc: `${form.code}/${form.suffix}(${form.type})${form.nrcNumber}`,
      gender: form.gender,
      subjects: Object.values(form.subjects).filter(sub => (sub as any)?.length > 0) as string[]
    }

    if(!id) {
      student.id = this.generatedId()
      return of<number>(this.database.push(student))
    } else {
      student.id = id
      this.database[this.database.findIndex(s => s.id == id)] = student
      return of<number>(this.database.length)
    }

  }

  findAll() {
    return new Array(...this.database)
  }

  findById(id: number): Student {
    return this.database.find(s => s.id == id) as Student
  }

  private generatedId(): number {
    if(this.database.length == 0) {
      return 1;
    }

    return this.getMax(this.database.map(stu => stu.id as number))
  }

  private getMax(nums: number[]) {
    let max = 0
    for(let i = 0; i < nums.length; i ++) {
      if(nums[i] > max)
        max = nums[i]
    }
    return max
  }

}
