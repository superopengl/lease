import { NgModule }			from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }	 from '@angular/forms';
import { AppComponent }	from './app.component';
import { SignInComponent }	from './signin.component';
// import {HeroDetailComponent} from './hero-detail.component';

@NgModule({
	imports: [ BrowserModule, FormsModule ],
	declarations: [ AppComponent, SignInComponent ],
	bootstrap: [ SignInComponent ]
})
export class AppModule { }