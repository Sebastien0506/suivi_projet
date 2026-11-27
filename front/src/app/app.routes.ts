import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PageResetPasswordComponent } from './page-reset-password/page-reset-password.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MyProjectComponent } from './my-project/my-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { UpdateProjectComponent } from './update-project/update-project.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'reset_password', component: ResetPasswordComponent},
    {path: 'pageResetPassword', component: PageResetPasswordComponent},
    {path: 'userProfile', component: UserProfileComponent},
    {path: 'myProject', component: MyProjectComponent},
    {path: 'createProject', component: CreateProjectComponent},
    {path: 'updateProject', component: UpdateProjectComponent},
];
