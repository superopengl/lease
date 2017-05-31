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
	User, Patient
} from "../../data/dtos";
import {
	NotificationService
} from "./notification.service";
import { Router } from "@angular/router";

interface SignIn {
	name : string;
	password : string;
	role: string;
}

interface SignUp {
	name ? : string;
	password ? : string;
	confirm ? : string;
	role?: string;
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
			const result = await this.apiService.raw.post("auth", this.model);
			this.contextService.context.user = result.user;
			this.contextService.context.role = this.model.role;
			this.notificationService.info(result);
			
			this.router.navigateByUrl('/pdashboard');

			// this.applicationRef.tick();
		} catch (error) {
			this.contextService.context.user = null;
			this.contextService.context.role = null;
			// this.applicationRef.tick();
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

	model: SignIn = {
		name: null,
		password: null,
		role: null
	};
	newModel: SignUp = {};
}
