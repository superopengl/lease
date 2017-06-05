import {
	Component,
	OnInit,
} from '@angular/core';
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
import { BfgControlOptions } from 'ng-bootstrap-form-generator';

interface SignIn {
	name: string;
	password: string;
	role: string;
}

interface SignUp {
	name: string;
	password: string;
	confirm: string;
}

@Component({
	selector: 'meco-signin',
	templateUrl: 'signin.html'
})
export class SignInComponent implements OnInit {
	ngOnInit(): void {}

	constructor(private notificationService: NotificationService, private contextService: ContextService, private apiService: ApiService, private router: Router) {}

	async onLogin() {
		try {
			const result = await this.apiService.raw.post("auth", this.model);
			this.contextService.context.user = result.user;
			this.contextService.context.role = this.model.role;
			this.router.navigateByUrl('/pdashboard');
		} catch (error) {
			this.message = error.toString();
			this.contextService.context.user = null;
			this.contextService.context.role = null;
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
			this.message = error.toString();
			this.notificationService.error(error);
		}
	}

	model: SignIn = {
		name: null,
		password: null,
		role: null
	};
	newModel: SignUp = {
		name: null,
		password: null,
		confirm: null
	};

	message: string = null;

	resetLoginForm() {
		this.model = {
			name: null,
			password: null,
			role: null
		};
	}

	loginFormConfig: BfgControlOptions[] = [
		{
			field: 'name',
			type: 'text',
			title: 'User Name',
			required: true,
			maxlength: 20
		},
		{
			field: 'password',
			type: 'password',
			title: 'Password',
			helpText: 'Password should be strong',
			required: true,
			minlength: 6
		},
		{
			field: 'role',
			type: 'radio-button-group',
			title: 'Role',
			required: true,
			helpText: 'Select a role',
			select: {
				options: [
					{ text: 'Patient', value: 'patient' },
					{ text: 'Doctor', value: 'doctor' }
				]
			}
		}
	];

	signInFormConfig: BfgControlOptions[] = [
		{
			field: 'name',
			type: 'text',
			title: 'User Name',
			required: true,
			maxlength: 20
		},
		{
			field: 'password',
			type: 'password',
			title: 'Password',
			helpText: 'Password should be strong',
			required: true,
			minlength: 6
		},
		{
			field: 'confirm',
			type: 'password',
			title: 'Confirm',
			required: true,
			minlength: 6
		}
	];
}
