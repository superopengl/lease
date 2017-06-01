import {
	Component,
	OnInit
} from '@angular/core';
import { ContextService } from "./context.service";
import { Doctor, Lease } from "../../data/dtos";
import { ApiService } from "./api.service";
import * as moment from "moment";

@Component({
	selector: 'meco-ddashboard',
	templateUrl: 'ddashboard.html'
})
export class DoctorDashboardComponent implements OnInit {
	ngOnInit(): void {
		// console.log(this.contextService.context);
		// const userId = this.contextService.context.user.id;
		// this.apiService.doctor.findOne({user_id: userId})
		// 	.then(d => {
		// 		this.doctor = d;
		// 	});
	}
	mlogs: any[];
	doctor: Doctor;
	leaseId: string;
	acknowledgeUrl: string;
	_leaseId: string;
	_expireAt: Date;

	get expire_at(): Date {
		return this._expireAt;
	}
	constructor(private apiService: ApiService, private contextService: ContextService){}

	scanning: boolean;

	// async createLease() {
	// 	this._expireAt = moment().add(2, 'hours').toDate();
	// 	const lease: Lease = {
	// 		expire_at: this._expireAt,
	// 		state: 'Created',
	// 		requiredBy: this.contextService.context.user.id,
	// 		acknowledgedBy: null,
	// 		cancelledBy: null
	// 	};
	// 	const id = await this.apiService.lease.create(lease);
	// 	this._leaseId = id;
	// 	this._acknowledgeUrl = `${this.apiService.restApiBaseUrl}lease/${id}/acknowledge`;
	// }

	decodedOutput(value: string){
		this.acknowledgeUrl = value;// console.log('>>> debug', JSON.stringify(event));
		this.scanning = false;

		console.log('acknowledgeUrl', this.acknowledgeUrl);
		console.log('scanning', this.scanning);
	}
}