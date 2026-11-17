import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { RouterLink } from '@angular/router';
import { MyProject, MyProjectService, Objective } from './my-project.service';
import { MatExpansionModule, MatExpansionPanel, MatAccordion, MatExpansionPanelTitle, MatExpansionPanelHeader, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
  selector: 'app-my-project',
  standalone: true,
  imports: [MatProgressBarModule, MatIcon, MatButtonModule, RouterLink, MatExpansionPanel, MatAccordion, MatExpansionPanelTitle, MatExpansionPanelHeader, MatCheckboxModule, MatExpansionPanelDescription],
  templateUrl: './my-project.component.html',
  styleUrl: './my-project.component.css'
})
export class MyProjectComponent {

  constructor(private dialog: MatDialog, private myProjectService: MyProjectService){}


  myProject: MyProject[] = [];

  readonly panelOpenState = signal(false);
  isCompleted = signal(false);

  //On déclare la variable pour stocker tous les objectif accompli
  objectiveAccompleted: boolean[] = [];


  ngOnInit(){
    this.myProjectService.getMyProject().subscribe({
      next: (data) => {
        this.myProject = data;
        console.log("Mes projet :", this.myProject);

        
        
        
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  updateObjective(objective: Objective, checked: boolean){
    objective.is_completed = checked;
    console.log(objective.is_completed);
  }


  calculateProgress(project: MyProject): number{
    const objectiveAccompleted: boolean[] = [];

    for (const objective of project.objectives){
      if(objective.is_completed === true){
        objectiveAccompleted.push(objective.is_completed);
      }
    }

    if(project.objectives.length === 0){
      return 0;
    }
    return(objectiveAccompleted.length / project.objectives.length) * 100;
  }
 
  openDialog(){
    
  }
  
}
