import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateProjectService } from './create-project.service';
@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatOption, MatSelectModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {

  constructor(private createProjectService: CreateProjectService){}

  private snackBar = inject(MatSnackBar);

  //On déclare une variable pour les message d'erreur 
  errorMessage = signal("");

  //On déclare une variable pour les message de succès
  successMessage = signal("");

  //Nom du projet
  projectForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  
    //Type du projet (ex: developpement web, montage video, etc...)
    project_type: new FormControl('other', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  
    //Objectives du projet (ex: Authentification, montage sons, etc...)
    objectives: new FormArray([
      new FormGroup({
        title: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required]
        })
      })
    ])
  });
  
  get objectives() {
    return this.projectForm.controls.objectives;
  }
  
  addObjective() {
    this.objectives.push(
      new FormGroup({
        title: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required]
        })
      })
    );
  }
  
  removeObjective(index: number) {
    this.objectives.removeAt(index);
  }
  
  createProject() {
    if (this.projectForm.invalid) return;
  
    console.log(this.projectForm.getRawValue());
  }

  checkTitleProject(): boolean{
    //On récupère le nom du projet
    const titleProject = this.projectForm.value.title?.trim();

    //Si aucun titre est donnée on retourne un message d'erreur
    if(!titleProject){
      this.errorMessage.set("Le titre du porojet ne peut pas être vide.");
      this.snackBar.open(
        this.errorMessage(),
        "Fermer",
        {
          duration: 3000
        }
      )
      return false;
    }

    //On fait le regex pour le titre du projet
    const regexTitleProject = /^[\p{L}\p{N} .\-_]+$/u;

    //On vérife que le titre contient uniquement des caractères autorisé
    if (!regexTitleProject.test(titleProject)){
      this.errorMessage.set("Le titre du projet contient des caractères interdit");
      this.snackBar.open(
        this.errorMessage(),
        "Fermer",
        {
          duration: 3000
        }
      )
      return false;
    }
    return true;
  }

  checkTypeProject(): boolean{

    //On récupère le type de projet
    const projectType = this.projectForm.value.project_type;
    console.log('Type de projet :', projectType);

    //On définit les type de projet autorisé
    const projectTypeAllowed = [
      "web",
      "video",
      "music",
      "design",
      "other"
    ];


    
    if(!projectType || !projectTypeAllowed.includes(projectType)){
      this.errorMessage.set("Le type de projet sélectionné n'est pas autorisé");

      this.snackBar.open(
        this.errorMessage(),
        "Fermer",
        {
          duration: 3000
        }
      )
      return false;
    }

    
    return true;
  }

  checkObjectif(): boolean{
    //On récupère les objectifs
    const objectif = this.projectForm.value.objectives;
    console.log("Objectif: ", objectif);

    if(!objectif){
      this.errorMessage.set("Au moins un objectif doit être renseigner");
      this.snackBar.open(
        this.errorMessage(),
        "Fermer",
        {
          duration: 3000
        }
      )
      return false;
    }

    //On crée le regex
    const regexTitleObjectifs = /^[\p{L}\p{N} .\-_]+$/u;
   //pour chaque objectif on vérifie qu'il ne contient pas de caractères interdit
    for(const objectifItem of objectif){
      const titleObjectifs = objectifItem.title?.trim();

      if(!titleObjectifs){
        this.errorMessage.set("Aucun objectif renseigné");
        this.snackBar.open(this.errorMessage(), "Fermer", {
          duration: 3000
        })
        return false;
      }

      //on normalise le titre de l'objectif
      const titleObjectifsNormalized = titleObjectifs.normalize("NFC");

      if(!regexTitleObjectifs.test(titleObjectifsNormalized)){
        this.errorMessage.set("Le titre de l'objectif contient des caractères interdits");
        this.snackBar.open(this.errorMessage(), "Fermer", {
          duration: 3000
        })
        return false;
      }
    }
    return true;
  }

  sendeRequest(){
    //On vérifie toutes les fonction
    const checkTitleProject = this.checkTitleProject();
    const checkTypeProject = this.checkTypeProject();
    const checkObjectif = this.checkObjectif();

    if(!checkTitleProject || !checkObjectif || !checkTypeProject){
      return;
    }
    console.log("checkObjectif :", checkObjectif);
    console.log("checkTitleProject :", checkTitleProject);
    console.log("checkTitleProject :", checkTitleProject);

    //On stock les données dans la variable data
    const data =  {
      title : this.projectForm.value.title,
      objectives: this.projectForm.value.objectives,
      project_type: this.projectForm.value.project_type,
    };
    console.log("data :", data);
    this.createProjectService.sendRequestCreateProject(data).subscribe({
      next: (res) => {
        this.successMessage.set(res.success ?? '');
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
    });
  }
}
