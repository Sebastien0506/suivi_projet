import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordService } from './reset-password.service';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButton],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  token: string | null = null;

  constructor(private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private resetPasswordService: ResetPasswordService){}

  //On initialise la variable pour récupérer le nouveau mot de passe
  passwordInput = new FormControl("");

  //On initialise une variable pour stocker les message d'erreur
  errorMessage = signal("");
  successMessage = signal("");


  ngOnInit(){
    this.token = this.activatedRoute.snapshot.queryParamMap.get("token");

  }


  //On crée la fonction pour vérifier le nouveau mot de passe
  checkNewPassword(): boolean{
    //On stocke le nouveau mot de passe dans un variable
    const password = this.passwordInput.value?.trim();
    console.log("Mot de passe :", password);

    //On vérifie que le nouveau mot de passe n'est pas vide
    if(!password){
      this.errorMessage.set("Le champs 'Mot de passe' est vide.");
      this.snackBar.open(
        this.errorMessage(),
        "Fermer", 
        {
          duration: 3000
        }
      )
      return false;
    }

    //On crée les regex pour le nouveau mot de passe
    const regexUppercase = /[\p{Lu}]/u;
    const regexLowercase = /[\p{Ll}]/u;
    const regexNumber = /[\p{N}]/u;
    const regexSpecial = /[@$!%*?&#_-]/;

    //On vérifie que le mot de pass contient au moins un caractère de chaque
    if(!regexUppercase.test(password) || !regexLowercase.test(password) || !regexNumber.test(password) || !regexSpecial.test(password)){
      this.errorMessage.set("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractères spécial.");
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

  sendRequest() {
       //On vérifie le token
       if(!this.token){
        return;
       }

       //On récupère la fonction pour vérifier le mot de passe
       const checkNewPassword = this.checkNewPassword();
       console.log("CheckNewPassword", checkNewPassword);

       //On vérifie si elle est vrai
       if(!checkNewPassword){
        return;
       }

       //On stock les données dans la variable data
       const data = {
        token: this.token,
        password: this.passwordInput.value,
       }

       //on fait la requête
       this.resetPasswordService.sendrequestResetPassword(data).subscribe({
        next: (res) => {
          this.successMessage.set("Mot de passe modifié");
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
  };

}
