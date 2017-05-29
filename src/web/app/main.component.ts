import {
	Component,
	OnInit,
	Input
} from '@angular/core';
import { ContextService } from "./context.service";

@Component({
	selector: 'meco-main',
	templateUrl: 'main.html'
})
export class MainComponent implements OnInit {
	ngOnInit(): void {
	}

	get roleName(): string {
		return this.contextService.context.role;
	}
	get userName(): string{
		let user = this.contextService.context.user;
		return user ? user.name : 'Not logged in';
	}
	constructor(private contextService: ContextService){
	}
	setRole(role:string){
		this.contextService.context.role = role;
	}

	isDoctor(): boolean {
		return this.contextService.context.role === 'doctor';
	}

	isPatient(): boolean {
		return this.contextService.context.role === 'patient';
	}
}