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
	_modalRef: NgbModalRef;

	get expire_at(): Date {
		return this._expireAt;
	}
	constructor(private apiService: ApiService, private contextService: ContextService, private modalService: NgbModal){}

	openAquireLeaseModal(content: any) {
		this.acknowledgeUrl = null;
		this._modalRef = this.modalService.open(content);
	}

	decodedOutput(value: string){
		this.acknowledgeUrl = value;
		if(this._modalRef) {
			this._modalRef.close();
		}
	}
}