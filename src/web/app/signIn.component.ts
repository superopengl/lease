import {
	Component,
	OnInit
} from '@angular/core';
import { SignInUpService } from "./signin.service";
import { CookieService } from 'ng2-cookies';
//import { HeroService } from './hero.service';

class SignIn {
	name?: string;
	password?: string;
}

class SignUp {
	name?: string;
	password?: string;
	confirm?: string;
}

@Component({
	selector: 'meco-signin',
	templateUrl: 'signin.html',
	providers: [CookieService]
})
export class SignInComponent implements OnInit {
	ngOnInit(): void {
	}

	constructor(private signInUpService: SignInUpService, private cookieService: CookieService){
	}

	onLogin() {
		this.signInUpService.login(this.model.name, this.model.password)
		.then(user => {
			const userId = user.id;
			this.cookieService.set("userId", userId);
		});
	}

	onSignUp() {
		this.signInUpService.signUp(this.newModel.name, this.newModel.password)
		.then(x => {
			console.log('good');
		})
		.catch(e => {
			console.log(e);
		});
	}

	model: SignIn = {};
	newModel: SignUp = {};
}

