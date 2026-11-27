import { Component, signal, inject } from '@angular/core';
import { MyProject, MyProjectService } from '../my-project/my-project.service';
import { FormsModule, ReactiveFormsModule, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { DeleteObjectifComponent } from '../delete-objectif/delete-objectif.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-update-project',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatIcon, MatButton, MatIconButton],
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.css'
})
export class UpdateProjectComponent {

  constructor(private projectService: MyProjectService){}

  objectives = new FormArray<FormControl<string>>([]);

  private dialog = inject(MatDialog);

  private snackBar = inject(MatSnackBar);

  //On déclare la variable pour stocker le message
  message = signal("");

  //On déclare la variable pour stocker le projet dans un tableau
  
  myProject: MyProject| null = null;
  ngOnInit(){
      //on récupère le projet
      this.myProject = this.projectService.selectedProject;
      console.log("Projet a modifier :", this.myProject);
    
  }

  addObjective(){
    this.objectives.push(
      new FormControl('', { nonNullable: true})
    );
  }
  removeObjective(index: number) {
    
    this.objectives.removeAt(index);
  }

  removeExistingObjectif(id: number){
     
    //  this.dialog.open(
    //   DeleteObjectifComponent, {
    //     data: {objectifId: id},
    //     width: "600px",
    //     height: "150px",
    //   }
    //  );
     const dialogRef = this.dialog.open(
      DeleteObjectifComponent,
      {
        data: {objectifId: id},
        width: "600px",
        height: "150px",
      }
     )
     dialogRef.afterClosed().subscribe(result => {
      this.message.set("Suppression de l'objectif réussi.");
      this.snackBar.open(
        this.message(),
        "Fermer",
        {
          duration: 3000
        }
      )
     });
     
  }
}
