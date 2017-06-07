import {
	Component,
	Input,
	OnInit,
	OnChanges,
	SimpleChanges
} from '@angular/core';
import { ContextService } from "./context.service";
import { Patient, Lease, MediOrder } from "../../data/dtos";
import { ApiService } from "./api.service";
import * as moment from "moment";
import { BfgControlOptions } from 'ng-bootstrap-form-generator';

@Component({
	selector: 'meco-mediorder-input',
	templateUrl: 'mediorder-input.html'
})
export class MediOrderInputComponent implements OnInit, OnChanges {
	async ngOnChanges(changes: SimpleChanges) {
		const newLeaseId = changes['leaseId'].currentValue;
		if(!this._lease || this._lease.id !== newLeaseId){
			this._lease = await this.apiService.lease.get(this.leaseId);
			this.validateLease(this._lease);
		}
	}
	private _lease: Lease;
	constructor(private apiService: ApiService, private contextService: ContextService){}
	
	async ngOnInit() {
		// this._lease = await this.apiService.lease.get(this.leaseId);
		// console.log('OnInit >>>', this._lease);
		// this.validateLease(this._lease);
		// this.model.doctorUserId = this._lease.requiredBy;
		// this.model.patientUserId = this._lease.acknowledgedBy;
		// this.model.place = 'VR clinic';
	}

	@Input() leaseId: string;
	model: MediOrder = {
		doctorUserId: null,
		patientUserId: null,
		timestamp: null,
		content: null
	};
	modelSchema: BfgControlOptions[] = [
		{
			field: 'content',
			type: 'text',
			title: 'Content',
			required: true,
			helpText: 'Medical order',
			maxlength: 500
		}
	];

	reset(){
		this.model.content = null;	
	}

	private validateLease(lease: Lease) {
		if(lease.cancelledBy){
			throw new Error('The lease has been cancelled');
		}
		if(lease.requiredBy !== this.contextService.context.user.id) {
			throw new Error(`The lease isn't required by the current user`);
		}
		if(!lease.approvedBy){
			throw new Error(`The lease hasn't been acknowledged by the record's owner`);
		}
	}

	async save(){
		if(!this._lease) {
			throw new Error('Lease is null');
		}
		this.model.timestamp = new Date();
		this.model.doctorUserId = this._lease.requiredBy;
		this.model.patientUserId = this._lease.approvedBy;
		this.model.place = 'VR clinic';
		await this.apiService.mediOrder.create(this.model);
		this.reset();
	}
}