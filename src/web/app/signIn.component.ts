import {
	Component,
	OnInit,
	ApplicationRef
} from '@angular/core';
import {
	ContextService
} from "./context.service";
import {
	ApiService
} from "./api.service";
import {
	User, BioLog
} from "../../data/dtos";
import {
	NotificationService
} from "./notification.service";
import { Router } from '@angular/router';

class SignIn {
	name ? : string;
	password ? : string;
}

class SignUp {
	name: string;
	password : string;
	confirm : string;
	role: string;
	bioInfo: BioLog;
}

@Component({
	selector: 'meco-signin',
	templateUrl: 'signin.html'
})
export class SignInComponent implements OnInit {
	ngOnInit(): void {}

	constructor(private notificationService: NotificationService, private contextService: ContextService, private applicationRef: ApplicationRef, private apiService: ApiService, private router: Router) {}

	async onLogin() {
		try {
			const query = {
				name: this.model.name,
				password: this.model.password
			};
			const user = await this.apiService.user.findOne(query);
			this.contextService.context.user = user;
			this.applicationRef.tick();
		} catch (error) {
			this.contextService.context.user = null;
			this.applicationRef.tick();
			this.notificationService.error(error);
		}
	}

	async onSignUp() {
		try {
			let user: User = {
				name: this.newModel.name,
				password: this.newModel.password
			};
			let userId = await this.apiService.user.create(user);
			user.id = userId;
			this.contextService.context.user = user;
			this.router.navigateByUrl('/role');
		} catch (error) {
			this.notificationService.error(error);
		}
	}

	model: SignIn = {};
	newModel: SignUp = new SignUp();
}
