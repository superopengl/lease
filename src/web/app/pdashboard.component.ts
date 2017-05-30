import {
	Component,
	OnInit
} from '@angular/core';
import { ContextService } from "./context.service";
import { Patient } from "../../data/dtos";
import { ApiService } from "./api.service";

@Component({
	selector: 'meco-pdashboard',
	templateUrl: 'pdashboard.html'
})
export class PatientDashboardComponent implements OnInit {
	ngOnInit(): void {
		const userId = this.contextService.context.user.id;
		this.apiService.patient.findOne({user_id: userId})
			.then(p => {
				this.patient = p;
			});
	}
	mlogs: any[];
	patient: Patient;
	leaseId: string;

	get first_name() {
		return this.patient ? this.patient.bio_info.first_name : '';
	}
	get last_name() {
		return this.patient ? this.patient.bio_info.last_name : '';
	}
	constructor(private apiService: ApiService, private contextService: ContextService){}

	createLease(): void {

	}

	cancelLease(): void {
		
	}
}