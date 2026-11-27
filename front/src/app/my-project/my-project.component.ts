import { Component, signal, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { RouterLink } from '@angular/router';
import { MyProject, MyProjectService, Objective } from './my-project.service';
import { MatExpansionModule, MatExpansionPanel, MatAccordion, MatExpansionPanelTitle, MatExpansionPanelHeader, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-project',
  standalone: true,
  imports: [MatProgressBarModule, MatIcon, MatButtonModule, RouterLink, MatExpansionPanel, MatAccordion, MatExpansionPanelTitle, MatExpansionPanelHeader, MatCheckboxModule, MatExpansionPanelDescription],
  templateUrl: './my-project.component.html',
  styleUrl: './my-project.component.css'
})
export class MyProjectComponent {

  constructor(private dialog: MatDialog, private myProjectService: MyProjectService, private route: Router){}


  myProject: MyProject[] = [];

  private snackBar = inject(MatSnackBar);

  readonly panelOpenState = signal(false);
  isCompleted = signal(false);

  //On déclare la variable pour stocker tous les objectif accompli
  objectiveAccompleted: boolean[] = [];

  successMessage = signal("");


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
    //On donne a objective.is_completed la valeur true ou false
    objective.is_completed = checked;
    console.log("Objectif :", objective.is_completed);
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
 
 

  updateProject(project: MyProject){
    

    this.myProjectService.selectedProject = project;
    this.route.navigate(['/updateProject']);

  }

  sendRequestObjectif(projectId: number){
    const project = this.myProject.find(p => p.id === projectId);
    if(!project) return;

        const data = {
          objectives: project.objectives.map(objective => ({
            id: objective.id,
            is_completed: objective.is_completed
          }))
      };

      this.myProjectService.sendUpdateObjectif(data).subscribe({
        next:(res) => {
          this.successMessage.set(res.success ?? "");
          this.snackBar.open(
            this.successMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
        },
        error: (err) => {
          console.error(err);
        }
      })
      console.log(data);
  
  }
}
