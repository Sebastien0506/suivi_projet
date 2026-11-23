import { Component, inject } from '@angular/core';
import { DeleteObjectifService } from './delete-objectif.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-objectif',
  standalone: true,
  imports: [MatButton],
  templateUrl: './delete-objectif.component.html',
  styleUrl: './delete-objectif.component.css'
})
export class DeleteObjectifComponent {

  constructor(private deleteObjectifService: DeleteObjectifService){}

  data = inject<{objectifId: number}>(MAT_DIALOG_DATA);

  dialogRef = inject(MatDialogRef);

  ngOnInit(){
    console.log("id de l'objectif :", this.data);
  }

  //Fonction pour fermer le module de dialog
  closeDialog(){
       this.dialogRef.close();
  }

  //Fonction pour supprimer l'objectif
  deleteObjectif(){
     //On initialise la varibale data pour stocker l'id de l'objectif
     const data = {
      id: this.data.objectifId,
     }
     console.log("Vérification de data dans deleteObjectif :", data);
  }
 

}
