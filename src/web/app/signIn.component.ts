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
import { BsfControlOptions } from 'ng-bootstrap-form-generator';

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

	constructor(private notificationService: NotificationService, private contextService: ContextService, private apiService: ApiService, private router: Router) {}

	async onLogin() {
		try {
			const result = await this.apiService.raw.post("auth", this.model);
			this.contextService.context.user = result.user;
			this.contextService.context.role = this.model.role;
			this.router.navigateByUrl('/pdashboard');
		} catch (error) {
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
			this.notificationService.error(error);
		}
	}

	model: SignIn = {
		name: null,
		password: null,
		role: null
	};
	newModel: SignUp = {};

	data = {
		id: '123',
		email: 'boby.mobi@example.com',
		name: 'Mobibob',
		password: 'AOe30&^@#!c2',
		howUserFindUs: '2',
		agreement: true,
	};
	message: string = null;

	reset() {
		this.data = {
		id: null,
		email: null,
		name: null,
		password: null,
		howUserFindUs: null,
		agreement: null,
		};
	}

	sendForm(data: any, valid: boolean) {
		if (valid) {
		this.message = 'Registration form sent';
		} else {
		this.message = 'Please fill form and fix all errors';
		}
	}

	formConfig: BsfControlOptions[] = [
		{
			field: 'id',
			type: 'hidden',
		},
		{
			field: 'email',
			type: 'email',
			title: 'Email',
			helpText: 'We will send confirmation email in order to finish registration',
			required: true
		},
		{
			field: 'name',
			type: 'text',
			title: 'User Name',
			required: true,
			maxlength: 15
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
			field: 'howUserFindUs',
			type: 'select',
			title: 'How did you find us?',
			helpText: 'You can keep this field empty',
			select: {
			emptyText: '-- How did you hear of us? --',
			options: [
				{ text: 'Facebook', value: 1 },
				{ text: 'LinkedIn', value: 2 },
				{ text: 'Google', value: 3 },
				{ text: 'Friends', value: 4 },
			]
			}
		},
		{
			field: 'agreement',
			type: 'checkbox',
			title: 'I accept license agreement',
			helpTextHtml: 'Read <a href="#license  ">license</a> before accept',
			requiredTrue: true,
			validationMessage: {
			required: 'Please, read and accept agreement'
			},
		}
	];
}
