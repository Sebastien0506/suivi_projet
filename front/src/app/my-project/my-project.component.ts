import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { RouterLink } from '@angular/router';
import { MyProject, MyProjectService } from './my-project.service';

@Component({
  selector: 'app-my-project',
  standalone: true,
  imports: [MatIcon, MatButtonModule, RouterLink],
  templateUrl: './my-project.component.html',
  styleUrl: './my-project.component.css'
})
export class MyProjectComponent {

  constructor(private dialog: MatDialog, private myProjectService: MyProjectService){}


  myProject : MyProject[] = [];

  ngOnInit(){
    this.myProjectService.getMyProject().subscribe({
      next: (data) => {
        this.myProject.push(data);
        console.log("mes projet :", this.myProject);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  
}
