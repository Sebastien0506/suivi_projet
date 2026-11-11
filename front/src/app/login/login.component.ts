import { Component, inject, signal } from '@angular/core';
import { LoginService } from './login.service';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { LoggedService } from '../logged.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    constructor(private LoginService: LoginService, private logged: LoggedService){}

    emailInput = new FormControl("");
    passwordInput = new FormControl("");

    dialoRef = inject(MatDialogRef);

    errorMessage = signal("");
    successMessage = signal("");

    private snackBar = inject(MatSnackBar);

    ngOnInit(){
      this.LoginService.getCsfr().subscribe({
        next: (res) => {
          console.log("Csrf récupérer avec succès :", res);
        },
        error: (err) => {
          console.error(err.error.error);
        }
      })
    }

    verifyInput(): boolean{
      const email = this.emailInput.value;
      const password = this.passwordInput.value;

      //Si l'email ou le mot de passe sont absent on renvoi un message d'erreur
      if(!email || !password){
           this.errorMessage.set("Un champs est manquant.");
           this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
           );
           return false
      }

      if(!email?.includes("@") || !email.includes(".")){
        this.errorMessage.set("Adresse email invalide.");
        this.snackBar.open(this.errorMessage(), "Fermer", { duration: 3000});
        return false;
      }
  
      if(email.indexOf("@") !== email.lastIndexOf("@")){
        this.errorMessage.set("L'adresse email contient plusieurs '@'");
        this.snackBar.open(this.errorMessage(), "Fermer", { duration: 3000});
        return false;
      }
  
      const domain = email.split("@")[1];
  
      //On crée le regex pour le nom de domaine
      const regexDomain = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*(?:\.[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*)+$/u;
      if(!regexDomain.test(domain)){
        this.errorMessage.set("Le nom de domaine de l'adresse email est invalide.");
        this.snackBar.open(
          this.errorMessage(),
          "Fermer",
          {
            duration: 3000
          }
        )
        return false;
      }
      //On récupère la chaine de caractère avant le @
      const beforeArobase = email.split("@")[0];
  
      //On crée le regex pour vérifie la chaine de caractère
      const regexBeforeArobase = /^[\p{L}\p{N}\-_]+$/u;
      
      //On vérifie si les deux correspondent
      if(!regexBeforeArobase.test(beforeArobase)){
        this.errorMessage.set("La chaine de caractère avant le '@' contient des caractères invalide.");
        this.snackBar.open(
          this.errorMessage(),
          "Fermer", 
          {
            duration: 3000
          }
        )
        return false;
      }

    //PARTI POUR VÉRIFIE LE MOT DE PASSE

    //On crée les regex pour le mot de passe
    const regexUppercase = /\p{Lu}/u;
    const regexNumber = /\p{N}/u;
    const regexSpecial = /[@$!%*?&#_-]/;

     if(!regexUppercase.test(password) || !regexNumber.test(password) || !regexSpecial.test(password)){
          this.errorMessage.set("Le mot de passe doit contenir au moins un chiffre, une majuscule et un caractère spécial.");
          this.snackBar.open(
            this.errorMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          return false;
     }
      return true
    }
  
    sendRequest(){
      //On vérifie la fonction verifyInput
      const verifyInput = this.verifyInput();

      if(!verifyInput){
        return;
      }

      const data = {
        email: this.emailInput.value,
        password: this.passwordInput.value,
      }
      //On fait la requête
      this.LoginService.sendRequestLogin(data).subscribe({
        next: (res) => {
          console.log("Connexion Réussie")
          this.logged.isLogged.set(true);
          this.successMessage.set(res.success ?? '');
          this.snackBar.open(
            this.successMessage(),
            "Fermer",
            {
              duration: 3000
            }
          )
          this.dialoRef.close();
        },
        error: (err) => {
          console.error("Erreur lors de la connexion");
        }
      });
    }
}
