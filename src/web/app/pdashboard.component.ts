import {
	Component,
	OnInit
} from '@angular/core';
import { ContextService } from "./context.service";
import { Patient, Lease } from "../../data/dtos";
import { ApiService } from "./api.service";
import * as moment from "moment";
@Component({
	selector: 'meco-pdashboard',
	templateUrl: 'pdashboard.html'
})
export class PatientDashboardComponent implements OnInit {
	ngOnInit(): void {
		console.log(this.contextService.context);
		const userId = this.contextService.context.user.id;
		this.apiService.patient.findOne({user_id: userId})
			.then(p => {
				this.patient = p;
			});
	}
	mlogs: any[];
	patient: Patient;
	leaseId: string;
	_acknowledgeUrl: string;
	_leaseId: string;

	get acknowledgeUrl(){
		return this._acknowledgeUrl;
	}

	get first_name() {
		return this.patient ? this.patient.bio_info.first_name : '';
	}
	get last_name() {
		return this.patient ? this.patient.bio_info.last_name : '';
	}
	constructor(private apiService: ApiService, private contextService: ContextService){}

	async createLease() {
		const lease: Lease = {
			expire_at: moment().add(2, 'hours').toDate(),
			state: 'Created',
			requiredBy: this.contextService.context.user.id,
			acknowledgedBy: null,
			cancelledBy: null
		};
		const id = await this.apiService.lease.create(lease);
		this._leaseId = id;
		this._acknowledgeUrl = `${this.apiService.restApiBaseUrl}lease/${id}/acknowledge`;
	}

	async cancelLease() {
		this._acknowledgeUrl = null;
		const user = this.contextService.context.user;
		await this.apiService.lease.cancel(this._leaseId, user);
	}
}