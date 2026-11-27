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
import { UpdateProjectService } from './update-project.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-update-project',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatIcon, MatButton, MatIconButton],
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.css'
})
export class UpdateProjectComponent {

  constructor(private projectService: MyProjectService, private updateProjectService: UpdateProjectService, private router: Router){}

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

  checkInput(): boolean{
    //On récupère les objectif dans le tableau
    const objectifs = this.objectives.value;

    //On vérifie que objectifs n'est pas un tableau vide
    if (objectifs.length === 0 || objectifs.some(obj => obj.trim() === "")) {
      this.message.set("Vous devez ajouter un nouvel objectif pour modifier le projet.");
      this.snackBar.open(
        this.message(),
        "Fermer",
        {
          duration: 3000
        }
      );
      console.log("Aucun nouveau objectif");
      return false;
    }
    console.log("Objectif dans le tableau objectives :", objectifs);

    //On crée le regex pour vérifier les titres des objectifs
    const regexObjectif = /^[\p{L}\p{N} \.-_]+$/u;
    
    //Pour chaque objectif
    for (const objectif of objectifs) {
      //on normalize les titres des objectifs
      const normalizeTitleObjectif = objectif.normalize("NFC");

      //On vérifie que le titre de l'bjectif ne contient aucun caractère interdit
      if(!regexObjectif.test(normalizeTitleObjectif)){
        return false;
      }
       console.log("objectif :", objectif);


    }
    return true;
  }

  removeExistingObjectif(id: number){
     
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

  sendNewObjectif() {
    //On récupère la fonction qui vérifie les titres des objectifs
    const checkObjectif = this.checkInput();
    
    //On vérifie la fonction
    if(!checkObjectif){
      return;
    }
    console.log("Résultat de checkObjectif :", checkObjectif);

    //On récupère l'id du projet
    const project_id = this.myProject?.id;
    console.log("id du projet : ", project_id);
    
    if(project_id){
       //On crée la variable data 
        const data = {
          objectives: this.objectives.value.map((title: string) => ({ title })),
        }
        console.log("Donnée :", data);
      //On envoi la requête
      this.updateProjectService.updateProject(project_id, data).subscribe({
          next: (res) => {
            if (res.status === 200){
              this.router.navigate(['/myProject']);
            }
          },
          error: (err) => {
            console.error("Erreur lors de la modification du projet :", err);
          }
      })
    }
    
  }
}
