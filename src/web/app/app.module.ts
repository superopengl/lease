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
import { PatientDashboardComponent } from "./pdashboard.component";
import { QRCodeModule } from 'angular2-qrcode';
import { DoctorDashboardComponent } from "./ddashboard.component";
import { QrScannerModule } from "angular2-qrscanner";

const appRoutes: Routes = [
	{ path: '', component: SignInComponent },
	{ path: 'role', component: RoleSignupComponent},
	{ path: 'pdashboard', component: PatientDashboardComponent},
	{ path: 'ddashboard', component: DoctorDashboardComponent},
	// otherwise redirect to home
	{ path: '**', redirectTo: '' }
];

@NgModule({
	imports: [ RouterModule.forRoot(appRoutes), BrowserModule, FormsModule, HttpModule, QRCodeModule, QrScannerModule],
	providers: [SignInUpService, ContextService, CookieService, ApiService, NotificationService],
	declarations: [ SignInComponent, MainComponent, NotificationComponent, RoleSignupComponent, PatientDashboardComponent, DoctorDashboardComponent],
	bootstrap: [ MainComponent ]
})
export class AppModule { }