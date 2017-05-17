import {
	Component,
	OnInit
} from '@angular/core';
//import {Hero} from './hero';
//import { HeroService } from './hero.service';


@Component({
	selector: 'my-app',
	template: '<h1>app component</h1>'
	//providers: [HeroService]
})
export class AppComponent implements OnInit {
	ngOnInit(): void {
	}

	constructor(){
	}

}

