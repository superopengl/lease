import {
	Component,
	OnInit,
} from '@angular/core';
import { ContextService } from "./context.service";
import { Patient, Lease } from "../../data/dtos";
import { ApiService } from "./api.service";
import * as moment from "moment";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

interface Model {
	expire_at: Date;
	acknowledgeUrl: string;
}

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

	patient: Patient;
	leaseId: string;
	_leaseId: string;
	required: boolean;
	_modalRef: NgbModalRef;
	_timerPolling: NodeJS.Timer;
	_timerExpiring: NodeJS.Timer;

	model: Model = {
		expire_at: null,
		acknowledgeUrl: null
	};

	get first_name(): string {
		return this.patient ? this.patient.bio_info.first_name : '';
	}
	get last_name(): string {
		return this.patient ? this.patient.bio_info.last_name : '';
	}

	constructor(private apiService: ApiService, private contextService: ContextService, private modalService: NgbModal){}

	async createLease() {
		this.model.expire_at = moment().add(2, 'hours').toDate();
		const lease: Lease = {
			expire_at: this.model.expire_at,
			state: 'Created',
			requiredBy: null,
			acknowledgedBy: null,
			cancelledBy: null
		};
		const id = await this.apiService.lease.create(lease);
		this._leaseId = id;
		this.model.acknowledgeUrl = `${this.apiService.restApiBaseUrl}lease/${id}/require`;
		this._timerPolling = this.startPollingLeaseState();
		this._timerExpiring = this.startPollingExpired();
	}

	async openModal(content: any) {
		await this.createLease();
		this._modalRef = this.modalService.open(content);
		this._modalRef.result.then(result => {
			this.cancelLease();
		}, reason => {
			this.cancelLease();
		});
	}

	private startPollingExpired(): NodeJS.Timer {
		const now = moment();
		const then = moment(this.model.expire_at);
		console.log('now', now.toDate());
		console.log('then', then.toDate());
		const expireInMs = then.diff(now, 'milliseconds');
		console.log('>>>', expireInMs);
		return setTimeout(() => {
			this.cancelLease();
		}, expireInMs);
	}

	private startPollingLeaseState(): NodeJS.Timer {
		this.required = false;
		let timer = setInterval(async () => {
			const lease = await this.apiService.lease.get(this._leaseId);
			if(lease.requiredBy) {
				this.required = true;
				this._modalRef.close();
				clearInterval(timer);
			}
		}, 500);
		return timer;
	}

	async cancelLease() {
		this.model.acknowledgeUrl = null;
		const user = this.contextService.context.user;
		await this.apiService.lease.cancel(this._leaseId, user);
		this.required = false;
		clearInterval(this._timerPolling);
		clearTimeout(this._timerExpiring);
	}
}