import * as uuid from "uuid";
import * as moment from "moment";

export interface Mloggable {
	id: string;
	mlog_id: string;
	mlog_timestamp: number;
}

export enum LeaseState {
	Created,
	Requested,
	Acknowledged,
	Expired,
	Cancelled
}

export class Context {
	currentUser: User;
}


interface ILease {
	id: string;
	state: LeaseState;
	expire_at ? : Date;
}

export interface Mlog {
	mlog_id: string;
	action: string; // Did what
	id: string;		// Against who
	at: number;		// When
	by: string;		// Wy whom
	in?: string; 	// Where
	extend: string;	// With what
}

export class Lease implements ILease {
	id: string;
	expire_at: Date;
	state: LeaseState;
	constructor(user: User, expire_in_munites: number) {
		this.id = uuid.v4();
		this.state = LeaseState.Created;
		this.expire_at = moment().add(expire_in_munites, "minutes").toDate();
	}

	private assertExpired(): void {
		if (this.state === LeaseState.Expired) {
			throw new Error("The lease expired");
		}
	}

	requireBy(user: User): string {
		this.assertExpired();
		this.state = LeaseState.Requested;
		return this.id;
	}

	acknowledgeBy(user: User): string {
		this.assertExpired();
		this.state = LeaseState.Acknowledged;
		return this.id;
	}

	cancel(user: User): string {
		this.assertExpired();
		this.state = LeaseState.Cancelled;
		return this.id;
	}
}

export interface MediOrder {
	id?: string;
	patientUserId: string;
	timestamp?: Date;
	doctorUserId: string;
	content: string;
}

export interface User {
	id?: string;
	name: string;
	password: string;
	culture?: string;
}

export interface Patient {
	id?: string;
	user_id: string;
	bio_info: BioLog;
	contacts?: ContactLog;
	allergies?: AllergyLog[];
	conditions?: ConditionLog[];
	measurements?: MeasurementLog[];
	familyHistory?: FamilyHistoryLog[];
}

export interface Doctor {
	id?: string;
	user_id: string;
	bio_info?: BioLog;
	contacts?: ContactLog;
	educations?: any[];
	licenses?: any[];
	work_history?: any[];
	working_in?: any[];
}

export enum BloodType {
	"A+",
	"A-",
	"B+",
	"B-",
	"O+",
	"O-",
	"AB+",
	"AB-"
}

export interface ConditionLog {
	name: string;
	status: string;
	start_at: Date;
	end_at: Date;
	how_it_ended: string;
	note: string;
}

export interface ContactLog {
	name: string;
	relationship: string;
	email: string;
	phone: string;
	address: string;
}

export interface FamilyHistoryLog {
	relationship: string;
	relative_name: string;
	gender: string;
	blood_type: string;
	dob: Date;
	dod: Date;
	condition: string;
	start_at: Date;
	end_at: Date;
	how_it_ended: string;
	note: string;
}

export interface MeasurementLog {
	name: string;
	context: string;
	type: string;
	operate_at: Date;
	data: string;
	unit: string;

}

export interface MedicineLog {
	name: string;
	dose: string;
	from_date: Date;
	to_date?: Date;
}

export interface AllergyLog {
	type: string;
	description: string;
	reaction: string;
	found_at: Date;
}

export interface BioLog {
	name: string;
	dob: Date;
	gender: string;
	race: string;
	blood_type: string;
}