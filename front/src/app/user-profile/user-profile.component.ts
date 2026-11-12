import { Component, signal, inject } from '@angular/core';
import { UserInfo, UserProfileService } from './user-profile.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatIcon, MatButton],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  constructor( private userProfileService: UserProfileService){}

  private dialog = inject(MatDialog);

  //On déclare une variale pour stock les info
  userInfo: UserInfo| null = null;



  //Au chargement de la page on fait la requête pour récupérer les données
  ngOnInit(){
     this.userProfileService.getUserInfo().subscribe({
      next: (data) => {
        //On stock les données reçus dans data
        this.userInfo = data;
        console.log(this.userInfo);
      },
      error: (err) => {
        console.error(err);
      }
     })
  }

  openDialogUpdateUser() {
    const dialogRef = this.dialog.open(UpdateUserComponent,
      {data: {userData: this.userInfo}}
    )
  }

}
