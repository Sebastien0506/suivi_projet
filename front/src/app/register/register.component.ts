import { Component, signal, inject } from '@angular/core';
import { RegisterService } from './register.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private registerService: RegisterService) {}

  //On initialise un message d'erreur
  errorMessage = signal("");

  //On initialise une variable pour un message de succès
  successMessage = signal("");

  usernameInput = new FormControl("");
  lastnameInput = new FormControl("");
  emailInput = new FormControl("");
  passwordInput = new FormControl("");

  private snackBar = inject(MatSnackBar);

  ngOnInit(){
    this.registerService.getCsrf().subscribe({
      next: (res) => {
        console.log("Récupération du jeton csrf réussi :", res);
      },
      error: (err) => {
        console.error(err.error.error);
      }
    })
  }

  verifyInput(): boolean{
    //On récupère les valeurs
    const username = this.usernameInput.value?.trim();
    const lastname = this.lastnameInput.value?.trim();
    const email = this.emailInput.value?.trim();
    const password = this.passwordInput.value?.trim();

    //On vérifie si tous les champs sont présent
    if(!username || !lastname || !email || !password){
        this.errorMessage.set("Un champs est manquant.");
        this.snackBar.open(this.errorMessage(), "Fermer", {duration: 3000});

        return false;
    }

    //On crée le regex de username
    const regexUsername = /^[\p{L}-]+$/u;

    //On normalize le username
    const normalizeUsername = username.normalize("NFC");

    //On vérifie que le le username correspond bien au regex
    if(!regexUsername.test(normalizeUsername)){
         this.errorMessage.set("Le champ 'Nom' contient des caractères non autorisé.");
         this.snackBar.open(this.errorMessage(), "Fermer", {duration: 3000});
         return false;
    }

    //On fait la vérification pour les prénom
    const regexLastName = /^[\p{L} -]+$/u;

    //On normalize le prénom
    const normalizeLastName = lastname.normalize("NFC");

    //On vérifie que le prénom contient uniquement des caractères autorisé.
    if(!regexLastName.test(normalizeLastName)){
      this.errorMessage.set("Le champs 'Prénom' contient des caractères non autorisé.");
      this.snackBar.open(this.errorMessage(), "Fermer", { duration: 3000});
      return false;
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

  onSubmit(event: Event) {
    event.preventDefault();
  
    console.log("Soumission interceptée");
    this.sendRequest();
  }

  sendRequest() {
    console.log("SendRequest appelée");
    //On réupère la fonction
    const verifyData = this.verifyInput();
    console.log(verifyData);

    if(!verifyData){
      return;
    }

    //On déclare la variable data pour stocker les données
    const data = {
      username: this.usernameInput.value,
      last_name: this.lastnameInput.value,
      email: this.emailInput.value,
      password: this.passwordInput.value,
    }
    console.log("Donnée dans :", data);
    //On envoi la requête
    this.registerService.sendRequestRegister(data).subscribe({
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
        console.error("Erreur HTTP :", err.status);
        console.error("Réponse Django :", err.error);
      }
    });
  }

}
