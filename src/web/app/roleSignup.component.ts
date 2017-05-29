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
	Patient, BioLog, Doctor
} from "../../data/dtos";
import {
	NotificationService
} from "./notification.service";

class SignUp {
	name: string;
	password : string;
	confirm : string;
	role: string;
	bioInfo: BioLog;
}

@Component({
	selector: 'meco-role-signup',
	templateUrl: 'role-signup.html'
})
export class RoleSignupComponent implements OnInit {
	ngOnInit(): void {
		let userId = this.contextService.context.user.id;
		this.patientModel.user_id = userId;
		this.doctorModel.user_id = userId;
	}

	constructor(private notificationService: NotificationService, private contextService: ContextService, private apiService: ApiService) {}

	async onSignUpPatient() {
		try {
			await this.apiService.patient.create(this.patientModel);
		} catch (error) {
			this.notificationService.error(error);
		}
	}

	async onSignUpDoctor() {
		try {
			await this.apiService.doctor.create(this.doctorModel);
		} catch (error) {
			this.notificationService.error(error);
		}
	}

	patientModel: Patient = {
		user_id: null,
		bio_info: {
			first_name: null,
			last_name: null,
			dob: null,
			race: null,
			gender: null,
			blood_type: null
		}
	};
	doctorModel: Doctor = {
		user_id: null,
		bio_info: {
			first_name: null,
			last_name: null,
			dob: null,
			race: null,
			gender: null,
			blood_type: null
		}
	};
}