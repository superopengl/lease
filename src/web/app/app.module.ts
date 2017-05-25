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

// import {HeroDetailComponent} from './hero-detail.component';

@NgModule({
	imports: [ BrowserModule, FormsModule, HttpModule ],
	providers: [SignInUpService, ContextService, CookieService, ApiService],
	declarations: [ SignInComponent, MainComponent ],
	bootstrap: [ MainComponent ]
})
export class AppModule { }