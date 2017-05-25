import {
	Component,
	OnInit,
	ApplicationRef
} from '@angular/core';
import { SignInUpService } from "./signin.service";
import { CookieService } from 'ng2-cookies';
import { ContextService } from "./context.service";
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
	templateUrl: 'signin.html'
})
export class SignInComponent implements OnInit {
	ngOnInit(): void {
	}

	constructor(private signInUpService: SignInUpService, private contextService: ContextService, private applicationRef: ApplicationRef){
	}

	onLogin() {
		this.signInUpService.login(this.model.name, this.model.password)
		.then(user => {
			this.contextService.user = user;
			this.applicationRef.tick();
		}).catch(err => {
			this.contextService.user = null;
			this.applicationRef.tick();
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

