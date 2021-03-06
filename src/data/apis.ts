import * as dto from './dtos';
import {IMlogRepo, MlogRepo} from "./repos";
import * as mongo from "mongodb";
import { GenericRepoFactory } from "./genericRepo";

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
	async query(query: any, limit: number): Promise<T[]> {
		return await this.repo().query(query, limit);
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
	// async createBy(user: dto.User): Promise<dto.Lease> {
	// 	const leasePeriod = 2 * 60; // In minutes
	// 	const lease = new dto.Lease(user, leasePeriod);
	// 	await this.repo().add(lease);
	// 	return lease;
	// }
}

 class UserApi extends BaseRestApi<dto.User> {
	constructor(){
		super("users");
	}

	async find(name: string, password: string): Promise<dto.User> {
		const query = {name, password};
		const users = await this.repo().query(query, 1);
		if(users && users.length) {
			return users[0];
		}
		throw new Error(`Invalid sign in`);
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

class MediOrderApi extends BaseRestApi<dto.MediOrder> {
	constructor(){
		super("mediorders");
	}
}

export const lease = new LeaseApi();
export const user = new UserApi();
export const patient = new PatientApi();
export const doctor = new DoctorApi();
export const order = new MediOrderApi();

const connectionString = process.env.MECO_MONGODB_CONNECTION_STRING;
const dbPromise = mongo.MongoClient.connect(connectionString);

export const apiFactory = new GenericRepoFactory(dbPromise);