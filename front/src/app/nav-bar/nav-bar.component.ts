import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { LoggedService } from '../logged.service';
import { Router } from '@angular/router';
import { NavBarService } from './nav-bar.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    constructor(public logged: LoggedService, private route: Router, private navBarService: NavBarService){}

    private dialog = inject(MatDialog);

    private snackBar = inject(MatSnackBar);

    successMessage = signal("");
    

    ngOnInit(){
     this.logged.checkLogin();
    }



    openDialogConnexion(){
      const dialogRef = this.dialog.open(LoginComponent, { width: '400px', height:'600px'});
      dialogRef.afterClosed().subscribe(result => {
        this.route.navigate(["/pageResetPassword"]);
      })
    }

    openDialogRegister(){
      const dialogRef = this.dialog.open(RegisterComponent, {width: '400px', height:'600px'});
    }

    sendRequestLogout(){
      //On appel la fonction pour supprimer les cookies
      this.navBarService.logout().subscribe({
        next: (response) => {
             this.successMessage.set(response.message ?? '');
             this.snackBar.open(
              this.successMessage(),
              "Fermer",
              {
                duration: 3000
              }
             )
             this.logged.isLogged.set(false);
        },
        error: (error) => {
          console.error(error);
        }
      })
    }

}
