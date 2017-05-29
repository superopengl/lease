import {
	Component,
	OnInit,
	ApplicationRef
} from '@angular/core';
import {
	SignInUpService
} from "./signin.service";
import {
	CookieService
} from 'ng2-cookies';
import {
	ContextService
} from "./context.service";
import {
	ApiService
} from "./api.service";
import {
	User
} from "../../data/dtos";
import {
	NotificationService
} from "./notification.service";

class SignIn {
	name ? : string;
	password ? : string;
}

class SignUp {
	name ? : string;
	password ? : string;
	confirm ? : string;
}

@Component({
	selector: 'meco-signin',
	templateUrl: 'signin.html'
})
export class SignInComponent implements OnInit {
	ngOnInit(): void {}

	constructor(private notificationService: NotificationService, private contextService: ContextService, private applicationRef: ApplicationRef, private apiService: ApiService) {}

	async onLogin() {
		try {
			const query = {
				name: this.model.name,
				password: this.model.password
			};
			const user = await this.apiService.user.findOne(query);
			this.contextService.context.user = user;
			this.applicationRef.tick();
			this.notificationService.info(user);
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
			let id = await this.apiService.user.create(user);
			this.notificationService.info(id);
		} catch (error) {
			this.notificationService.error(error);
		}
	}

	model: SignIn = {};
	newModel: SignUp = {};
}
