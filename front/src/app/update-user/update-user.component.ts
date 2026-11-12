import { Component, inject, signal } from '@angular/core';
import { UpdateUserService } from './update-user.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { UserInfo } from '../user-profile/user-profile.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatDialogActions, MatDialogContent, ReactiveFormsModule, FormsModule, MatButton],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
   
  constructor(private updateUserservice: UpdateUserService){}

  private snackBar = inject(MatSnackBar);

  user =inject<{userData: UserInfo}>(MAT_DIALOG_DATA) ;

  errorMessage = signal("");
  successMessage = signal("");

  username = new FormControl(this.user.userData.username);
  lastName = new FormControl(this.user.userData.last_name);
  email = new FormControl(this.user.userData.email);

  private dialog = inject(MatDialogRef);
    // user = inject<{userData: string}>(MAT_DIALOG_DATA);
  
    closeDialog(){
       this.dialog.close();
    }

    //On fait la fonction pour vérifier les données dans les input
    checkInput(): boolean{
      //On récupère toutes les données
      const username = this.username.value;
      const lastName = this.lastName.value;
      const email = this.email.value;

      //On vérifie que aucun champs n'est vide
      if(!username || !lastName || !email){
          this.errorMessage.set("Un champs est manquant.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
      }

      //On fait la regex pour le nom
      const regexUsername = /^[\p{L} \-']+$/u;

      //On normalize le username
      const normalizeUsername = username.normalize("NFC");

      //On vérifie que le nom ne contient aucun caractères non autorisé
      if(!regexUsername.test(normalizeUsername)){
        this.errorMessage.set("Le champ 'Nom' contient des caractères interdit")
        this.snackBar.open(
          this.errorMessage(),
          "Fermer",
          {
            duration: 3000
          }
        )
        return false;
      }

      //On fait le regex pour le prénom
      const regexLastName = /^[\p{L} \-']+$/u;
      //on normalize le prenom
      const normalizeLastName = lastName.normalize("NFC");

      //On vérifie que le prénom ne contient pas de caractères interdit
      if(!regexLastName.test(normalizeLastName)){
        this.errorMessage.set("Le champ 'Prénom' contient des caractères interdit.");
        this.snackBar.open(
          this.errorMessage(),
          "Fermer",
          {
            duration: 3000
          }
        )
        return false;
      }

      //On vérifie que l'email contient un @
      if(!email.includes("@")){
        this.errorMessage.set("L'email doit contenir un '@' ");
        this.snackBar.open(
          this.errorMessage(),
          "Fermer",
          {
            duration: 3000
          }
        )
        return false;
      }

      //On vérifie que l'email ne contient que un seul @
      if(email.indexOf("@") != email.lastIndexOf("@")){
        this.errorMessage.set("L'email ne doit contenir que un seul '@' ");
        this.snackBar.open(
          this.errorMessage(),
          "Fermer",
          {
            duration: 3000
          }
        )
        return false;
      }

      //On fait le regex
      const regexEmail = /^[\p{L}\p{N}._-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+$/u;

      //On vérifie que l'email correspond a la regex
      if(!regexEmail.test(email)){
        this.errorMessage.set("L'email contient des caractères interdit.");
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

    //On envoi la requête
    sendRequest(){
       //On check la vérification
       const checkInput = this.checkInput();

       if(!checkInput){
        return;
       }

       console.log("chekInput :", checkInput);

       

       //On stock les données dans data
       const data = {
        username: this.username.value,
        last_name: this.lastName.value,
        email: this.email.value,
       }

       this.updateUserservice.sendRequestUpdateUser(data).subscribe({
        next: (res) => {
          this.successMessage.set(res.success ?? '');
          this.snackBar.open(
            this.successMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          this.dialog.close();
        },
        error: (err) => {
          this.errorMessage.set("Erreur lors de la modification.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          console.error(err);
        }
       })
    }
}
