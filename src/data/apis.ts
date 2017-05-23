import * as dto from './dtos';
import {IMlogRepo, MlogRepo} from "./repos";


abstract class BaseRestApi<T extends {id?: string}> {
	private repoInternal: IMlogRepo<T>;
	constructor(collectionName: string){
		this.repoInternal = new MlogRepo<T>(collectionName);
	}
	protected repo(): IMlogRepo<T> {
		return this.repoInternal;
	}
	async get(id: string): Promise<T> {
		return await this.repo().getLatest(id);
	}
	async gegAll(): Promise<T[]> {
		return await this.repo().query({});
	}
	async update(id:string, item: T): Promise<T> {
		item.id = id;
		await this.repo().add(item);
		return item;
	}
	async create(item: T): Promise<string> {
		return await this.repo().add(item);
	}
}

 class LeaseApi extends BaseRestApi<dto.Lease> {
	constructor(){
		super("leases");
	}
	async get(id: string): Promise<dto.Lease> {
		return await this.repo().getLatest(id);
	}
	async update(id:string, item: dto.Lease): Promise<dto.Lease> {
		item.id = id;
		await this.repo().add(item);
		return item;
	}
	async createBy(user: dto.User): Promise<dto.Lease> {
		const leasePeriod = 2 * 60; // In minutes
		const lease = new dto.Lease(user, leasePeriod);
		await this.repo().add(lease);
		return lease;
	}
}

 class UserApi extends BaseRestApi<dto.User> {
	constructor(){
		super("users");
	}
}

 class PatientApi extends BaseRestApi<dto.Patient> {
	constructor(){
		super("patients");
	}
}

 class DoctorApi extends BaseRestApi<dto.Doctor> {
	constructor(){
		super("doctors");
	}
}

export const lease = new LeaseApi();
export const user = new UserApi();
export const patient = new PatientApi();
export const doctor = new DoctorApi();