import { Routes } from '@angular/router';
import { TemplateStudentListComponent } from './template/template-student-list/template-student-list.component';
import { ProgrammerService } from './model/services/programmer.service';

export const routes: Routes = [
  {
    path: 'template',
    loadComponent: () => import("./template/template.component")
                          .then(c => c.TemplateComponent),
    title: 'Angular * Template Form'
  },
  {
    path: 'template',
    children: [
      {
        path: 'students',
        component: TemplateStudentListComponent,
        title: 'Angular * Template Student List'
      }
    ]
  },
  {
    path: 'reactive',
    loadComponent: () => import("./reactive/reactive.component")
                          .then(c => c.ReactiveComponent),
    title: 'Angular * Reactive Form',
    providers: [ProgrammerService]
  },
  {
    path: 'dynamic',
    loadComponent: () => import("./dynamic/dynamic.component")
                          .then(c => c.DynamicComponent),
    title: 'Angular * Dynamic Form'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/template'
  }
];
