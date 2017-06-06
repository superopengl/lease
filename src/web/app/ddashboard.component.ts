import {
	Component,
	OnInit
} from '@angular/core';
import { ContextService } from "./context.service";
import { Doctor, Lease } from "../../data/dtos";
import { ApiService } from "./api.service";
import * as moment from "moment";
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'meco-ddashboard',
	templateUrl: 'ddashboard.html'
})
export class DoctorDashboardComponent implements OnInit {
	ngOnInit(): void {
		console.log(this.contextService.context);
		const userId = this.contextService.context.user.id;
		this.apiService.doctor.findOne({user_id: userId})
			.then(d => {
				this.doctor = d;
			});
	}
	doctor: Doctor;
	acknowledgeUrl: string;
	_expireAt: Date;
	_modalRef: NgbModalRef;
	model: any = {
		canInput: false,
		leaseId: null
	}
	_timerPolling: number;

	get expire_at(): Date {
		return this._expireAt;
	}
	constructor(private apiService: ApiService, private contextService: ContextService, private modalService: NgbModal){}

	openAquireLeaseModal(content: any) {
		this.acknowledgeUrl = null;
		this._modalRef = this.modalService.open(content);
		this._modalRef.result.then(result => {
			// clearInterval(this._timerPolling);
		}, reason => {
			// clearInterval(this._timerPolling);
		});
	}

	decodedOutput(value: string){
		console.log('scanned value', value);
		if(!value) {
			return;
		}

		this.acknowledgeUrl = value;
		const leaseId = value;
		this.apiService.lease.require(leaseId, this.contextService.context.user);
		this._modalRef.close();
		this.pollingLeaseApproval(leaseId);
	}

	private pollingLeaseApproval(leaseId: string): void{
		this._timerPolling = setInterval(this.pollingCallback.bind(this, leaseId), 1000);
	}

	private async pollingCallback(leaseId: string) {
		const lease = await this.apiService.lease.get(leaseId);
		if(lease.acknowledgedBy) {
			this.model.canInput = true;
			this.model.leaseId = lease.id;
			clearInterval(this._timerPolling);
		}
	}
}