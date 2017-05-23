import {
	Component,
	OnInit
} from '@angular/core';
//import {Hero} from './hero';
//import { HeroService } from './hero.service';


@Component({
	selector: 'meco-signin',
	templateUrl: 'signin.html'
	//providers: [HeroService]
})
export class SignInComponent implements OnInit {
	ngOnInit(): void {
	}

	constructor(){
	}

	onSignIn() {

	}

	onSignUp() {

	}

	model = {};
}

