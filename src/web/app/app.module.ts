import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }	 from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SignInComponent }	from './signin.component';
import { SignInUpService } from "./signin.service";
import { MainComponent } from "./main.component";
import { ContextService } from "./context.service";
import { CookieService } from 'ng2-cookies';
import { ApiService } from "./api.service";
import { NotificationService } from "./notification.service";
import { NotificationComponent } from "./notification.component";
import { RouterModule, Routes } from "@angular/router";
import { RoleSignupComponent } from "./roleSignup.component";

const appRoutes: Routes = [
	{ path: '', component: SignInComponent },
	{ path: 'role', component: RoleSignupComponent},
	// otherwise redirect to home
	{ path: '**', redirectTo: '' }
];

@NgModule({
	imports: [ RouterModule.forRoot(appRoutes), BrowserModule, FormsModule, HttpModule ],
	providers: [SignInUpService, ContextService, CookieService, ApiService, NotificationService],
	declarations: [ SignInComponent, MainComponent, NotificationComponent, RoleSignupComponent],
	bootstrap: [ MainComponent ]
})
export class AppModule { }