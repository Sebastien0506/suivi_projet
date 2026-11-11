import { Component, inject } from '@angular/core';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    constructor(){}

    private dialog = inject(MatDialog);

    openDialogConnexion(){
      const dialogRef = this.dialog.open(LoginComponent, { width: '400px', height:'600px'});
    }

    openDialogRegister(){
      const dialogRef = this.dialog.open(RegisterComponent, {width: '400px', height:'600px'});
    }
}
