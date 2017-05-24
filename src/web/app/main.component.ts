import {
	Component,
	OnInit
} from '@angular/core';
import { ContextService } from "./context.service";

@Component({
	selector: 'meco-main',
	templateUrl: 'main.html'
})
export class MainComponent implements OnInit {
	ngOnInit(): void {
		this.getUser();
	}
	roleName: string;
	userName: string;
	constructor(private contextService: ContextService){
	}
	setRole(role:string){
		this.roleName = role;
		this.contextService.role = role;
	}
	getUser() {
		let user = this.contextService.user;
		this.userName = user ? user.name : 'Not logged in';
		// this.contextService.getUser().then(u => this.userName = u ? u.name : null);
	}

	isDoctor(): boolean {
		return this.contextService.isDoctor();
	}

	isPatient(): boolean {
		return this.contextService.isPatient();
	}
}