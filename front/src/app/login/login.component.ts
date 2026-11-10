import { Component } from '@angular/core';
import { LoginService } from './login.service';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    constructor(private LoginService: LoginService){}

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

}
