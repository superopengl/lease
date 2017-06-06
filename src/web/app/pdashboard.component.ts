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
	await_req: boolean;
	await_ack: boolean;
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
	_modalRef: NgbModalRef;
	_timerPolling: NodeJS.Timer;
	_timerExpiring: NodeJS.Timer;
	_lease: Lease;

	model: Model = {
		expire_at: null,
		acknowledgeUrl: null,
		await_req: false,
		await_ack: false
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
		this._lease = {
			expire_at: this.model.expire_at,
			state: 'Created',
			requiredBy: null,
			acknowledgedBy: null,
			cancelledBy: null
		};
		const id = await this.apiService.lease.create(this._lease);
		this._lease.id = id;
		this.model.await_req = true;
		// this.model.acknowledgeUrl = `${this.apiService.restApiBaseUrl}lease/${id}/require`;
		this.model.acknowledgeUrl = id;
		this._timerPolling = this.startPollingLeaseState();
		this._timerExpiring = this.startPollingExpired();
	}

	shouldShowQrCode(): boolean {
		return this._lease !== null && !this.expires() && this._lease.requiredBy === null && this.model.acknowledgeUrl !== null;
	}

	shouldShowAck(): boolean {
		return this._lease !== null && !this.expires() && this._lease.requiredBy !== null;
	}

	expires(): boolean {
		return moment(this._lease.expire_at) <= moment();
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

	async approve() {
		this._lease = await this.apiService.lease.acknowledge(this._lease.id, this.contextService.context.user);
		this._modalRef.close();
	}

	private startPollingExpired(): NodeJS.Timer {
		const now = moment();
		const then = moment(this.model.expire_at);
		const expireInMs = then.diff(now, 'milliseconds');
		return setTimeout(() => {
			this.cancelLease();
		}, expireInMs);
	}

	private startPollingLeaseState(): NodeJS.Timer {
		let timer = setInterval(async () => {
			this._lease = await this.apiService.lease.get(this._lease.id);
			if(this._lease.requiredBy) {
				clearInterval(timer);
			}
		}, 500);
		return timer;
	}

	async cancelLease() {
		this.model.acknowledgeUrl = null;
		const user = this.contextService.context.user;
		await this.apiService.lease.cancel(this._lease.id, user);
		clearInterval(this._timerPolling);
		clearTimeout(this._timerExpiring);
	}
}