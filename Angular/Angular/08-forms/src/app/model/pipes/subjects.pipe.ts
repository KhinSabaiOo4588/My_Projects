import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'subjects',
  standalone: true
})
export class SubjectsPipe implements PipeTransform {

  transform(value: string[], param: 'short' | 'long' = 'long'): string {
    if(param == "long") {
      return value.join(" | ")
    }
    return value.map(v => {
      if(v == "Maths") {
        return "Math"
      }
      return v.substring(0, 3)
    }).join(" | ")
  }

}
