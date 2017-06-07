import {
	Component,
	OnChanges,
	SimpleChanges,
	OnInit,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import { ContextService } from "./context.service";
import { Lease } from "../../data/dtos";
import { ApiService } from "./api.service";
import * as moment from "moment";
import { NotificationService } from "./notification.service";

class LeaseWorkflow {
	@Output() onEstablish = new EventEmitter<string>();
	@Input() userId: string;
	lease: Lease;
	
	constructor(protected apiService: ApiService, protected notificationService: NotificationService){}
	
	async getLease(leaseId: string): Promise<Lease> {
		return this.apiService.lease.get(leaseId);
	}

	protected assertNull(lease: Lease){
		this.throwIf(!lease, "lease is null");
	}

	protected throwIf(conditional: boolean, message: string){
		if(conditional) {
			throw new Error(message);
		}
	}

	protected AssertNotRequired(lease: Lease){
		this.assertNull(lease);
		this.throwIf(!!lease.requiredBy, `The lease has been required (${lease.id})`);
	}

	protected AssertNotApproved(lease: Lease){
		this.assertNull(lease);
		this.throwIf(!!lease.approvedBy, `The lease has been approved (${lease.id})`);
	}

	protected AssertNotCancelled(lease: Lease){
		this.assertNull(lease);
		this.throwIf(!!lease.cancelledBy, `The lease has been cancelled (${lease.id})`);
	}
}

@Component({
	selector: 'meco-lease-guest',
	templateUrl: 'meco-lease-guest.html'
})
export class LeaseWorkflowGuestComponent extends LeaseWorkflow {
	// async ngOnChanges(changes: SimpleChanges) {
	// 	const newLeaseId = changes['leaseId'].currentValue;
	// 	try{
	// 		if(!this.lease || this.lease.id !== newLeaseId){
	// 			const lease = await this.apiService.lease.get(newLeaseId);
	// 			this.AssertNotCancelled(lease);
	// 			this.AssertNotApproved(lease);
	// 			this.AssertNotRequired(lease);
	// 			this.lease = lease;
	// 			this.updateModelWithWelcome();
	// 		}
	// 	}catch(err){
	// 		this.lease = null;
	// 		this.notificationService.error(err);
	// 	}
	// }

	model: {
		showsWelcome: boolean;
		showsCamera: boolean;
		statusMessage: string;
	} = {
		showsWelcome: true,
		showsCamera: false,
		statusMessage: null
	};
	private _timerPolling: number;
	constructor(apiService: ApiService, notificationService: NotificationService) {
		super(apiService, notificationService);
		this.updateModelWithReset();
	}

	async require() {
		// Open camera and waiting for a QR code
		this.model.showsCamera = true;
	}

	private updateModelWithReset() {
		this.model.showsWelcome = true;
		this.model.showsCamera = false;
		this.model.statusMessage = "Click button to generate a QR code for data sharing.";
	}

	private updateModelWithCamera() {
		this.model.showsWelcome = false;
		this.model.showsCamera = true;
		this.model.statusMessage = "Scan a QR code with the camera window.";
	}

	private updateModelWithWaitingApproval() {
		this.model.showsWelcome = false;
		this.model.showsCamera = false;
		this.model.statusMessage = "Waiting for the owner's approval.";
	}

	private updateModelWithRejected() {
		this.model.showsWelcome = true;
		this.model.showsCamera = false;
		this.model.statusMessage = "The lease was rejected by the owner.";
	}

	private updateModelWithCancelled() {
		this.model.showsWelcome = true;
		this.model.showsCamera = false;
		this.model.statusMessage = "The lease was cancelled by the owner.";
	}

	private updateModelWithExpired() {
		this.model.showsWelcome = true;
		this.model.showsCamera = false;
		this.model.statusMessage = "The lease has expired.";
	}

	startScan() {
		this.updateModelWithCamera();
	}

	cancel() {
		if(this._timerPolling) {
			clearInterval(this._timerPolling);
		}
		this.updateModelWithReset();
	}

	private isValidUuid(value: string): boolean {
		return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i.test(value);
	}

	async onCapture(leaseId: string) {
		// The callback when a QR code is detected by camera.
		console.log('Scanned value:', leaseId, '. Is valid UUID: ', this.isValidUuid(leaseId));
		if(!this.isValidUuid(leaseId)) {
			return;
		}
		this.model.showsCamera = false;
		this.throwIf(!leaseId, "Invalid QR code");
		this.lease = await this.apiService.lease.require(leaseId, this.userId);
		this.updateModelWithWaitingApproval();
		this.pollApproval(leaseId);
	}

	private pollApproval(leaseId: string): void{
		this._timerPolling = setInterval(this.pollingApprovalCallback.bind(this, leaseId), 1000);
	}

	private async pollingApprovalCallback(leaseId: string) {
		try{
			const lease = await this.apiService.lease.get(leaseId);
			this.lease = lease;

			if(lease.approvedBy) {
				this.updateModelWithReset();
				this.onEstablish.emit(lease.id);
			}else if(lease.cancelledBy) {
				this.updateModelWithCancelled();
			}else if(lease.rejectedBy) {
				this.updateModelWithRejected();
			}else if(lease.expire_at < new Date()) {
				this.updateModelWithExpired();
			}else{
				// Continues polling
				return;
			}

			clearInterval(this._timerPolling);
		}catch(err){
			console.log("polling error", err, this.lease);
			clearInterval(this._timerPolling);
			this.updateModelWithReset();
		}
	}
}

@Component({
	selector: 'meco-lease-owner',
	templateUrl: 'meco-lease-owner.html'
})
export class LeaseWorkflowOwnerComponent extends LeaseWorkflow {
	model: {
		showsWelcome: boolean;
		showsQrCode: boolean;
		showsApproveOrReject: boolean;
		statusMessage: string;
	} = {
		showsWelcome: true,
		showsQrCode: false,
		showsApproveOrReject: false,
		statusMessage: null
	};
	private _timerPolling: NodeJS.Timer;
	private _timerExpiring: NodeJS.Timer;

	constructor(apiService: ApiService, notificationService: NotificationService) {
		super(apiService, notificationService);
		this.updateModelWithReset();
	}

	private updateModelWithReset(){
		this.model.showsWelcome = true;
		this.model.showsQrCode = false;
		this.model.showsApproveOrReject = false;
		this.model.statusMessage = "Click to scan QR code for data access.";

	}
	private updateModelWithWelcome(){
		this.model.showsWelcome = true;
		this.model.showsQrCode = false;
		this.model.showsApproveOrReject = false;
		this.model.statusMessage = "Click button to generate a one-time QR code to share your records to a guest.";
	}

	private updateModelWithQrCode(){
		this.model.showsWelcome = false;
		this.model.showsQrCode = true;
		this.model.showsApproveOrReject = false;
		this.model.statusMessage = "Waiting for the guest to scan the QR code.";
	}

	private updateModelWithApproveOrReject(){
		this.model.showsWelcome = false;
		this.model.showsQrCode = false;
		this.model.showsApproveOrReject = true;
		this.model.statusMessage = "Click approve button to approve the access request, or reject/cancel the lease.";
	}

	async create() {
		this.lease = {
			expire_at: moment().add(2, 'hours').toDate(),
			requiredBy: null,
			approvedBy: null,
			rejectedBy: null,
			cancelledBy: null
		};
		const id = await this.apiService.lease.create(this.lease);
		this.lease.id = id;
		this._timerPolling = this.startPollingTillRequired();
		this._timerExpiring = this.startPollingTillExpired();
		this.updateModelWithQrCode();
	}

	async approve() {
		this.lease = await this.apiService.lease.approve(this.lease.id, this.userId);
		this.updateModelWithReset();
		this.onEstablish.emit(this.lease.id);
	}

	private startPollingTillExpired(): NodeJS.Timer {
		const now = moment();
		const then = moment(this.lease.expire_at);
		const expireInMs = then.diff(now, 'milliseconds');
		return setTimeout(() => {
			this.cancel();
		}, expireInMs);
	}

	private startPollingTillRequired(): NodeJS.Timer {
		let timer = setInterval(async () => {
			this.lease = await this.apiService.lease.get(this.lease.id);
			if(this.lease.requiredBy) {
				clearInterval(timer);
				this.updateModelWithApproveOrReject();
			}
		}, 1000);
		return timer;
	}

	async reject() {
		this.lease = await this.apiService.lease.reject(this.lease.id, this.userId);
		clearInterval(this._timerPolling);
		clearTimeout(this._timerExpiring);
		this.updateModelWithWelcome();
	}

	async cancel() {
		this.lease = await this.apiService.lease.cancel(this.lease.id, this.userId);
		clearInterval(this._timerPolling);
		clearTimeout(this._timerExpiring);
		this.updateModelWithWelcome();
	}
}