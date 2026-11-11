import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageResetPasswordService } from './page-reset-password.service';
@Component({
  selector: 'app-page-reset-password',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatButton],
  templateUrl: './page-reset-password.component.html',
  styleUrl: './page-reset-password.component.css'
})
export class PageResetPasswordComponent {

  constructor( private snackBar: MatSnackBar, private pageResetPasswordService: PageResetPasswordService){}

  errorMessage = signal("");

  message = signal("");

  emailInput = new FormControl("", [Validators.required, Validators.email]);

  checkEmailInput(): boolean{
    const email = this.emailInput.value;

    if(!email){
      this.errorMessage.set("L'email est incorrect.");
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

  sendRequest(){
    //On récupère la fonction qui permet de vérifier si l'email est correct
    const checkEmailInput = this.checkEmailInput();
    console.log("CheckEmailInput", checkEmailInput);

    if(!checkEmailInput){
      return;
    }

    const data = {
      email: this.emailInput.value,
    }
     
    this.pageResetPasswordService.sendEmailResetPassword(data).subscribe({
      next: (res) => {
         this.message.set("Un email vous à été envoyer");
         this.snackBar.open(
          this.message(),
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

  }

}
