import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageResetPasswordComponent } from './page-reset-password/page-reset-password.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'reset_password', component: ResetPasswordComponent},
    {path: 'pageResetPassword', component: PageResetPasswordComponent},
];
