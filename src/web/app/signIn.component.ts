import {
	Component,
	OnInit
} from '@angular/core';
import { SignInUpService } from "./signin.service";
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
	//providers: [HeroService]
})
export class SignInComponent implements OnInit {
	ngOnInit(): void {
	}

	constructor(private signInUpService: SignInUpService){
	}

	onSignIn() {

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

