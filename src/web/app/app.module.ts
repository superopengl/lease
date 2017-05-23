import { NgModule }			from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }	 from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent }	from './app.component';
import { SignInComponent }	from './signin.component';
import { SignInUpService } from "./signin.service";
// import {HeroDetailComponent} from './hero-detail.component';

@NgModule({
	imports: [ BrowserModule, FormsModule, HttpModule ],
	providers: [SignInUpService],
	declarations: [ AppComponent, SignInComponent ],
	bootstrap: [ SignInComponent ]
})
export class AppModule { }